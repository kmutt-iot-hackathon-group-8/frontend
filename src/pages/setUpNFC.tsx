import NFC from '../assets/icons/NFCIcon.png';

const setUpNFC = () => {

  return (
    <div className="relative w-480 h-270 bg-white font-['Montserrat']">
      {/* --- WAVE BACKGROUND --- */}
      <div className="absolute bottom-0 left-0 w-full h-[160vh] z-0 block">
        <svg 
            className="w-full h-full" 
            viewBox="-130 0 1340 320" 
            preserveAspectRatio="xMidYMax slice" 
            xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7dffdc" />
              <stop offset="50%" stopColor="#20D4A4" />
              <stop offset="100%" stopColor="#1F7CAE" />
            </linearGradient>
          </defs>
          <path fill="url(#wave-gradient)" fillOpacity="0.4" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="url(#wave-gradient)" fillOpacity="0.8" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* ModTap */}
      <h1 className="absolute w-67.25 h-19.5 left-213 top-27.25 font-['Montserrat'] font-bold text-[64px] leading-19.5 text-black z-10">
        ModTap
      </h1>

      {/* Set up NFC scanning now? */}
      <h2 className="absolute w-169.25 h-14.75 left-103.5 top-89 font-['Montserrat'] font-bold text-[48px] leading-14.75 text-black z-10">
        Set up NFC scanning now?
      </h2>

      {/* Description Text */}
      <p className="absolute w-183 h-21.75 left-103.5 top-110 font-['Montserrat'] font-bold text-2xl leading-7.25 text-black z-10">
        You'll need an NFC-enabled phone and a card to continue. Not ready? You can do this later from your profile.
      </p>

      {/* Scan Now Button */}
      <button className="absolute w-48.75 h-13 left-103.5 top-149.25 bg-linear-to-r from-[#20D4A4] to-[#1F7CAE] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] border-none cursor-pointer z-10">
        <span className="font-['Montserrat'] font-bold text-xl leading-6 text-white">
          Scan Now
        </span>
      </button>

      {/* Maybe Later Button */}
      <button className="absolute w-48.75 h-13 left-158.5 top-149.25 bg-[#A8BFC6] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] border-none cursor-pointer z-10">
        <span className="font-['Montserrat'] font-bold text-xl leading-6 text-white">
          Maybe Later
        </span>
      </button>

      {/* NFC Symbol Container */}
      <div className="box-border absolute w-98.25 h-67 left-319.25 top-88.75 hover:brightness-105 bg-linear-to-br from-[#7dffdc] to-[#69cafe] border border-dashed border-black rounded-[20px] z-10 flex items-center justify-center">
        {/* NFC Icon */}
        <img 
          src={NFC} 
          alt="NFC Symbol"
          className="w-[127.12px] h-28.25"
        />
      </div>
    </div>
  );
};

export default setUpNFC;