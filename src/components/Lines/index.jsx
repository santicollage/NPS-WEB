import './Lines.scss';


function Lines() {
  const lines = [
    {
      id: 1,
      logo: '/images/slider/chevrolet.avif',
      text: 'Chevrolet (FTR, FRR, FVR, NPR, NQR, NKR, NHR, FVZ, LUV Dimax)',
    },
    {
      id: 2,
      logo: '/images/slider/hino.avif',
      text: 'Hino (300, 500)',
    },
    {
      id: 3,
      logo: '/images/slider/mercedes.avif',
      text: 'Mercedes Benz (1726, 1016, LO915, 813, OF 917, 1725, 1730)',
    },
    {
      id: 4,
      logo: '/images/slider/foton.avif',
      text: 'Foton (ISF 2.8 - 3.8)',
    },
  ];

  return (
    <>
      <div className="lines-container">
        <h2 className="title">ESPECIALISTAS EN LINEAS</h2>
        <div className="lines">
          {lines.map((line) => (
            <div key={line.id} className="line">
              <img className="logo" src={line.logo} alt="logo" loading="lazy" />
              <p className="line-text">{line.text}</p>
            </div>
          ))}
        </div>
        <div className="glow"></div>
      </div>
    </>
  );
}

export default Lines;
