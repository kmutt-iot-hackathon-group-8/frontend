const WaveBackground = () => {
  return (
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
        <path
          fill="url(#wave-gradient)"
          fillOpacity="0.4"
          d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
        <path
          fill="url(#wave-gradient)"
          fillOpacity="0.8"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveBackground;
