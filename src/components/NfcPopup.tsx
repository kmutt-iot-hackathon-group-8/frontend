import { X, TriangleAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface NfcPopupProps {
  onClose: () => void;
}

const NfcPopup = ({ onClose }: NfcPopupProps) => {
  const qrCodeUrl = 'https://website.com/profile?mobilenfc=true';
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 font-montserrat transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`} 
      onClick={handleClose}
    >
      <div 
        className={`relative w-[1157px] h-[705px] bg-linear-to-r from-[#AFEEDD] to-[#6CB2D7] 
        border border-dashed border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[20px] p-8
        transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 w-[54px] h-[55px] bg-white/65 rounded-full flex items-center justify-center hover:bg-white/80 transition-all hover:scale-110 active:scale-95"
        >
          <X size={36} className="text-black" />
        </button>

        {/* Warning Icon and Text */}
        <div className="absolute top-[60px] left-1/2 -translate-x-1/2 flex items-center gap-2">
          <TriangleAlert size={26} className="text-black" />
          <p className="font-bold text-[20px] leading-6 text-black">
            You need to be on mobile to scan your NFC card.
          </p>
        </div>

        {/* QR Code */}
        <div className="absolute top-[143px] left-1/2 -translate-x-1/2 w-[419px] h-[419px] 
        border-[5px] border-dashed border-black rounded-[71px] flex items-center justify-center">
          <QRCodeSVG 
            value={qrCodeUrl}
            size={350}
            level="H"
            fgColor="#000000"
            bgColor="#FFFFFF00"
            includeMargin={false}
          />
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 text-center">
          <p className="font-bold text-[12px] leading-[15px] underline text-black cursor-pointer hover:opacity-80 ">
            <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer"> Alternatively, click here to open the link directly.</a>
          </p>
        </div>

        <div className="absolute bottom-[29px] left-1/2 -translate-x-1/2 text-center">
          <p className="font-bold text-[24px] leading-[29px] text-black">
            Scan the QR Code with mobile to continue on your mobile device  
          </p>
        </div>
      </div>
    </div>
  );
};

export default NfcPopup;
