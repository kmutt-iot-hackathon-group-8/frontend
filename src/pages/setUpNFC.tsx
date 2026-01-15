import NFC from '../assets/icons/NFCIcon.png';

const setUpNFC = () => {

  return (
    <div className="relative min-h-screen w-full bg-white font-['Montserrat'] overflow-x-hidden">
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
      <h1 className="relative left-[142px] top-[89px] w-[202px] font-['Montserrat'] font-bold text-5xl leading-[59px] text-black z-10
                     md:absolute md:left-1/2 md:-translate-x-1/2 md:w-auto md:text-[64px] md:leading-[78px] md:top-[109px]">
        ModTap
      </h1>

      {/* Profile Icon - Mobile Only */}
      <div className="absolute right-[40px] top-[62px] w-[96px] h-[97px] bg-[#8A8989] rounded-full flex items-center justify-center z-10
                      md:hidden">
        <svg className="w-[60px] h-[60px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="12" cy="8" r="3.5" stroke="#000000" strokeWidth="1.5"/>
            <path d="M6.5 19.5C6.5 17 9 15 12 15C15 15 17.5 17 17.5 19.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        </svg>
      </div>

      {/* NFC Symbol Container - Mobile positioned */}
      <div className="box-border relative mx-auto mt-[200px] w-[393px] h-[268px] 
                      bg-gradient-to-b from-[#AFEEDD] to-[#6CB2D7] 
                      border border-dashed border-black rounded-[20px] z-10 
                      flex items-center justify-center
                      md:absolute md:left-[1277px] md:top-[355px] md:mt-0">
        {/* NFC Icon */}
        <img 
          src={NFC} 
          alt="NFC Symbol"
          className="w-[127.12px] h-[113px]"
        />
      </div>

      {/* Content Container - Desktop positioned */}
      <div className="relative mt-12 px-6 z-10
                      md:absolute md:left-[414px] md:top-[356px] md:px-0">
        {/* Set up NFC scanning now? */}
        <h2 className="w-full font-['Montserrat'] font-bold text-3xl leading-tight text-black mb-4
                       md:w-[677px] md:text-[48px] md:leading-[59px]">
          Set up NFC scanning now?
        </h2>

        {/* Description Text */}
        <p className="w-full font-['Montserrat'] font-bold text-lg leading-relaxed text-black mb-8
                      md:w-[732px] md:text-2xl md:leading-[29px]">
          You'll need an NFC-enabled phone and a card to continue. Not ready? You can do this later from your profile.
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col gap-4 w-full
                        md:flex-row md:gap-5 md:w-auto">
          {/* Scan Now Button */}
          <button className="w-full h-[52px] bg-gradient-to-r from-[#20D4A4] to-[#1F7CAE] 
                             shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] border-none cursor-pointer
                             md:w-[195px]">
            <span className="font-['Montserrat'] font-bold text-xl leading-6 text-white">
              Scan Now
            </span>
          </button>

          {/* Maybe Later Button */}
          <button className="w-full h-[52px] bg-[#A8BFC6] 
                             shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[10px] border-none cursor-pointer
                             md:w-[195px]">
            <span className="font-['Montserrat'] font-bold text-xl leading-6 text-white">
              Maybe Later
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default setUpNFC;