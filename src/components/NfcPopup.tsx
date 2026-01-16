import { X, TriangleAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import NFC from '../assets/icons/NFCIcon.png';
import { useAuth } from '../context/AuthContext';

interface NfcPopupProps {
  onClose: () => void;
}

const NfcPopup = ({ onClose }: NfcPopupProps) => {
  const { user } = useAuth();
  const qrCodeUrl = user ? `${window.location.origin}/register?userId=${user.id}&mobile=true` : 'https://website.com/profile?mobilenfc=true';
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 font-montserrat transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
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
        ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 
          w-10 h-10 sm:w-11 sm:h-11.25 md:w-13.5 md:h-13.75
          bg-white/65 rounded-full flex items-center justify-center 
          hover:bg-white/80 transition-all hover:scale-110 active:scale-95 z-20"
        >
          <X className="text-black w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9" />
        </button>

        {/* ----------------- MOBILE LAYOUT ----------------- */}
        <div className="flex flex-col items-center justify-center h-full w-full md:hidden relative">
            
            {/* Centered NFC Icon */}
            <div className="mb-12 sm:mb-16">
                <img src={NFC} alt="NFC Icon" className="w-32 sm:w-40 h-auto" />
            </div>
            
            {/* Bottom Section */}
            <div className="absolute bottom-6 sm:bottom-8 w-full text-center px-4 flex flex-col gap-4">
                <p className="font-bold text-[18px] sm:text-[22px] leading-6 sm:leading-7 text-black">
                    Approach an NFC Card
                </p>
            </div>
        </div>

        {/* ----------------- DESKTOP LAYOUT ----------------- */}
        <div className="hidden md:block w-full h-full relative">
            <div className="absolute top-10 lg:top-15 left-1/2 -translate-x-1/2 flex items-center gap-2 ">
                <TriangleAlert className="text-black w-5 h-5 lg:w-6.5 lg:h-6.5 shrink-0" />
                <p className="font-bold text-[16px] lg:text-[20px] leading-5 lg:leading-6 text-black text-center">
                  You need to be on mobile to scan your NFC card.
                </p>
            </div>

            {/* QR Code Container */}
            <div className="absolute top-25 lg:top-30 left-1/2 -translate-x-1/2 
            w-70 h-70 sm:w-[320px] sm:h-80 md:w-87.5 md:h-82.5 lg:w-87.5 lg:h-87.5 xl:w-104.75 xl:h-104.75
            border-[3px] lg:border-[5px] border-dashed border-black 
            rounded-[40px] lg:rounded-[71px] flex items-center justify-center">
                <QRCodeSVG 
                    value={qrCodeUrl}
                    size={window.innerWidth >= 1280 ? 350 : window.innerWidth >= 1024 ? 320 : window.innerWidth >= 768 ? 260 : 240}
                    level="H"
                    fgColor="#000000"
                    bgColor="#FFFFFF00"
                    includeMargin={false}
                />
            </div>

            {/* Link below QR Code */}
            <div className='absolute top-97.5 sm:top-112.5 lg:top-127.5 xl:top-138.75 left-1/2 -translate-x-1/2 px-4'> 
                <p className="font-bold text-[10px] lg:text-[12px] leading-3.25 lg:leading-3.75 underline text-black cursor-pointer hover:opacity-80 text-center">
                   <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer">
                     Alternatively, click here to open the link directly.
                   </a>
                </p>
            </div>
           
            {/* Desktop Bottom Text */}
            <div className="absolute bottom-5 lg:bottom-7.25 left-1/2 -translate-x-1/2 text-center w-full px-4">
                <p className="font-bold text-[16px] lg:text-[20px] xl:text-[24px] leading-5 lg:leading-6 xl:leading-7.25 text-black">
                    Scan the QR Code with mobile to continue on your mobile device
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NfcPopup;