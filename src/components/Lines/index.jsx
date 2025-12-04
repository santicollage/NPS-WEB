import './Lines.scss';
import chevrolet from '../../assets/Images/Slider/chevrolet.png';
import hino from '../../assets/Images/Slider/hino.png';
import mercedes from '../../assets/Images/Slider/mercedes.png';
import foton from '../../assets/Images/Slider/foton.png';

function Lines() {
  const lines = [
    {
      id: 1,
      logo: chevrolet,
      text: 'Chevrolet (FTR, FRR, FVR, NPR, NQR, NKR, NHR, FVZ, LUV Dimax)',
    },
    {
      id: 2,
      logo: hino,
      text: 'Hino (300, 500)',
    },
    {
      id: 3,
      logo: mercedes,
      text: 'Mercedes Benz (1726, 1016, LO915, 813, OF 917, 1725, 1730)',
    },
    {
      id: 4,
      logo: foton,
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
              <img className="logo" src={line.logo} alt="logo" />
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
