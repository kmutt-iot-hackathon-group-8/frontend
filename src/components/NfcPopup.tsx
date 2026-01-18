import { X, CheckCircle, Wifi, ScanLine } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import NFC from "../assets/icons/NFCIcon.png";

interface NfcPopupProps {
  onClose: () => void;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface NDEFReadingEvent extends Event {
  serialNumber: string;
}

interface NDEFReader {
  scan: () => Promise<void>;
  onreading: (event: NDEFReadingEvent) => void;
  onreadingerror: (event: Event) => void;
}

declare global {
  interface Window {
    NDEFReader?: new () => NDEFReader;
  }
}

interface CardAddedData {
  cardId: string;
}

const NfcPopup = ({ onClose }: NfcPopupProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "scanning" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [scannedId, setScannedId] = useState("");

  // User Data
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.uid;

  const qrCodeUrl = `${window.location.origin}/profile?mobileLink=true`;

  const socketRef = useRef<Socket | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // --- DESKTOP: Socket Connection ---
  // Join the user's specific room and start linking session
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(BASE_URL);

    socketRef.current.emit("join_room", `user_${userId}`);
    console.log(`Joined room: user_${userId}`);

    fetch(`${BASE_URL}/api/v1/users/${userId}/link-card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    });

    socketRef.current.on("card_added", (data: CardAddedData) => {
      console.log("Card added event received:", data);
      setScannedId(data.cardId.toUpperCase());
      setStatus("success");
      setTimeout(() => {
        handleClose();
      }, 3000);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId]);

  // --- MOBILE: Web NFC & API ---
  const handleScan = async (cardId: string) => {
    if (!userId) {
      setErrorMessage("User not identified. Please login.");
      setStatus("error");
      return;
    }

    setStatus("processing");

    const isFormatted = /^[A-F0-9]{2}(:[A-F0-9]{2})*$/.test(
      cardId.toUpperCase(),
    );
    const formattedId = isFormatted
      ? cardId.toUpperCase()
      : cardId
          .toUpperCase()
          .replace(/[^A-F0-9]/g, "")
          .match(/.{1,2}/g)
          ?.join(":") || cardId;

    setScannedId(formattedId);

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/users/${userId}/link-card`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId: formattedId }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        // Mobile doesn't necessarily close immediately, giving feedback
        setTimeout(() => handleClose(), 2000);
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Failed to link card.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  const startNfcScan = async () => {
    setStatus("scanning");
    setErrorMessage("");

    if (window.NDEFReader) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();

        ndef.onreading = (event: NDEFReadingEvent) => {
          const serialNumber = event.serialNumber;
          if (serialNumber) {
            handleScan(serialNumber);
          } else {
            setErrorMessage("Could not read serial number.");
            setStatus("error");
          }
        };
      } catch (error) {
        console.error("NFC Error:", error);
        setStatus("error");
        setErrorMessage("NFC permission denied or error.");
      }
    } else {
      console.warn("Web NFC not supported.");
      setStatus("error");
      setErrorMessage("NFC not supported on this device.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 font-montserrat transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-linear-to-r from-[#AFEEDD] to-[#6CB2D7] 
        border border-dashed border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
        rounded-[15px] sm:rounded-[20px] 
        p-6 sm:p-8 
        transition-all duration-300 
        /* Mobile Sizing */
        w-[90vw] h-[70vh] max-w-100 max-h-162.5
        /* Tablet Sizing */
        sm:w-[85vw] sm:h-[65vh] sm:max-w-125 sm:max-h-175
        /* Desktop Sizing */
        md:w-200 md:h-150 
        lg:w-250 lg:h-162.5 
        xl:w-289.25 xl:h-176.25 
        md:max-w-[95vw] md:max-h-[90vh]
        ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 
          w-10 h-10 sm:w-11 sm:h-11.25 md:w-13.5 md:h-13.75
          bg-white/65 rounded-full flex items-center justify-center 
          hover:bg-white/80 transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
        >
          <X className="text-black w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9" />
        </button>

        {/* ----------------- MOBILE LAYOUT ----------------- */}
        <div className="flex flex-col items-center justify-center h-full w-full md:hidden relative px-4">
          {status === "success" ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-32 h-32 text-green-600 mb-6" />
              <h2 className="text-2xl font-bold text-black mb-2">Success!</h2>
              <p className="text-black/80">
                Card <span className="font-mono font-bold">{scannedId}</span>{" "}
                Linked Successfully
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* Centered NFC Icon or Scanner Animation */}
              <div
                className={`mb-6 sm:mb-10 relative ${status === "scanning" ? "animate-pulse" : ""}`}
              >
                <img src={NFC} alt="NFC Icon" className="w-28 sm:w-36 h-auto" />
                {status === "scanning" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="w-16 h-16 text-blue-600 animate-ping" />
                  </div>
                )}
              </div>

              <div className="text-center px-4 flex flex-col gap-4 mb-8">
                {status === "error" ? (
                  <p className="font-bold text-red-600 text-lg">
                    {errorMessage}
                  </p>
                ) : status === "scanning" ? (
                  <p className="font-bold text-lg text-blue-700">
                    Scanning... Hold card near device
                  </p>
                ) : (
                  <p className="font-bold text-[18px] sm:text-[22px] leading-6 sm:leading-7 text-black px-2">
                    {window.NDEFReader
                      ? "Tap card on Phone or IoT Device"
                      : "Tap card on IoT Device"}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full max-w-72">
                {window.NDEFReader && (
                  <button
                    onClick={startNfcScan}
                    disabled={status === "scanning" || status === "processing"}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-md active:scale-95 transition-transform"
                  >
                    {status === "scanning" ? "Scanning..." : "Start NFC Scan"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ----------------- DESKTOP LAYOUT ----------------- */}
        <div className="hidden md:flex flex-col items-center justify-center w-full h-full relative">
          {status === "success" ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-40 h-40 text-green-600 mb-8" />
              <h2 className="text-4xl font-black text-black mb-4">
                Card Added!
              </h2>
              <p className="text-xl text-black/70">
                NFC Card{" "}
                <span className="font-mono font-bold">{scannedId}</span> has
                been linked.
              </p>
            </div>
          ) : (
            <>
              <div className="absolute top-10 lg:top-15 left-1/2 -translate-x-1/2 flex items-center gap-2 ">
                <Wifi className="text-black w-5 h-5 lg:w-6.5 lg:h-6.5 shrink-0 animate-pulse" />
                <p className="font-bold text-[16px] lg:text-[20px] leading-5 lg:leading-6 text-black text-center">
                  Listening for mobile connection...
                </p>
              </div>

              {/* QR Code Container */}
              <div
                className="absolute top-25 lg:top-30 left-1/2 -translate-x-1/2 
                w-70 h-70 sm:w-[320px] sm:h-80 md:w-87.5 md:h-82.5 lg:w-87.5 lg:h-87.5 xl:w-104.75 xl:h-104.75
                border-[3px] lg:border-[5px] border-dashed border-black 
                rounded-[40px] lg:rounded-[71px] flex items-center justify-center bg-white/20"
              >
                <QRCodeSVG
                  value={qrCodeUrl}
                  size={
                    window.innerWidth >= 1280
                      ? 350
                      : window.innerWidth >= 1024
                        ? 320
                        : window.innerWidth >= 768
                          ? 260
                          : 240
                  }
                  level="H"
                  fgColor="#000000"
                  bgColor="#FFFFFF00"
                />
              </div>

              {/* Link below QR Code */}
              <div className="absolute top-97.5 sm:top-112.5 lg:top-127.5 xl:top-138.75 left-1/2 -translate-x-1/2 px-4">
                <p className="font-bold text-[10px] lg:text-[12px] leading-3.25 lg:leading-3.75 underline text-black cursor-pointer hover:opacity-80 text-center">
                  <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer">
                    Direct Link (Debug)
                  </a>
                </p>
              </div>

              {/* Desktop Bottom Text */}
              <div className="absolute bottom-5 lg:bottom-7.25 left-1/2 -translate-x-1/2 text-center w-full px-4">
                <p className="font-bold text-[16px] lg:text-[20px] xl:text-[24px] leading-5 lg:leading-6 xl:leading-7.25 text-black">
                  Scan with Phone OR tap card on IoT Device to link
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NfcPopup;
