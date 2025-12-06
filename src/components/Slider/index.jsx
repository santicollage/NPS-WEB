import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Lines from '../Lines';
import './Slider.scss';
import velocimetro1 from '../../assets/images/Slider/velocimetro1.svg';
import velocimetro2 from '../../assets/images/Slider/velocimetro2.svg';
import piston1 from '../../assets/images/Slider/pistons1.svg';
import piston2 from '../../assets/images/Slider/pistons2.svg';
import piston3 from '../../assets/images/Slider/pistons3.svg';
import caja from '../../assets/images/Slider/caja.png';
import suspension from '../../assets/images/Slider/suspension.png';
import ArrowIcon from '../../assets/icons/ArrowIcon';
import LineGlow from '../../components/LineGlow';

function Slider() {
  const [position, setPosition] = useState(1);
  const numberSliders = 4;
  const navigate = useNavigate();

  const handleNavigate = (slug) => {
    navigate(`/products/${slug ? slug : ''}`);
  };

  const calculatePosition = (index) => {
    if (position === index) {
      return 0;
    } else if ((position == 1 ? 4 : position - 1) === index) {
      return -100;
    } else {
      return 100;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev >= numberSliders ? (prev = 1) : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [position]);

  return (
    <>
      <h1 className="tittle-slider">
        El Mejor rendimiento comienza con las mejores piezas
      </h1>
      <div className="slider-container">
        <button
          onClick={() =>
            setPosition((prev) =>
              prev <= 1 ? (prev = numberSliders) : prev - 1
            )
          }
          className="slider-button button-left"
        >
          <ArrowIcon className="arrow-icon" />
        </button>
        <button
          onClick={() =>
            setPosition((prev) =>
              prev >= numberSliders ? (prev = 1) : prev + 1
            )
          }
          className="slider-button button-right"
        >
          <ArrowIcon className="arrow-icon" />
        </button>

        <div
          className="slider-card"
          style={{
            transform: `translateX(${calculatePosition(1)}%)`,
            opacity: position === 1 ? 1 : 0,
          }}
        >
          <div className="slider-image">
            <img
              className="image speedometer"
              src={velocimetro1}
              alt="velocimetro"
            />
            <img
              className="image speedometer needle"
              src={velocimetro2}
              alt="velocimetro"
            />
          </div>
          <div className="slider-text">
            <h1 className="tittle text-right">
              SERVICIO Y CALIDAD EN UN SOLO LUGAR
            </h1>
            <p className="text text-right">
              Ofrecemos nuestros servicios como proveedores de repuestos Diesel
              nuevos para su flota de vehículos
            </p>
          </div>
          <div className="vertical-line">
            <LineGlow orientation="vertical" width="80%" />
          </div>
        </div>

        <div
          className="slider-card motor"
          style={{
            transform: `translateX(${calculatePosition(2)}%)`,
            opacity: position === 2 ? 1 : 0,
          }}
        >
          <div className="slider-text">
            <h1 className="tittle">MOTOR</h1>
            <Lines />
            <p className="text"></p>
            <button onClick={() => handleNavigate()} className="button">
              <div className="glow"></div>VER MÁS
            </button>
          </div>
          <div className="slider-image">
            <img className="image pistons" src={piston1} alt="piston" />
            <img
              className="image pistons pistons1"
              src={piston2}
              alt="piston"
            />
            <img
              className="image pistons pistons2"
              src={piston3}
              alt="piston"
            />
            <div className="shadow"></div>
          </div>
        </div>

        <div
          className="slider-card"
          style={{
            transform: `translateX(${calculatePosition(3)}%)`,
            opacity: position === 3 ? 1 : 0,
          }}
        >
          <div className="slider-image">
            <img className="image" src={caja} alt="caja" />
            <div className="shadow"></div>
          </div>
          <div className="slider-text">
            <h1 className="tittle">CAJA Y TRANSMISIÓN</h1>
            <p className="text">
              Su vehículo merece lo mejor: Más de 30 marcas líderes en
              repuestos, calidad y confianza al alcance de su mano.
            </p>
            <button onClick={() => handleNavigate()} className="button">
              {' '}
              <div className="glow"></div>VER MÁS
            </button>
          </div>
        </div>

        <div
          className="slider-card"
          style={{
            transform: `translateX(${calculatePosition(4)}%)`,
            opacity: position === 4 ? 1 : 0,
          }}
        >
          <div className="slider-text">
            <h1 className="tittle">SUSPENSIÓN</h1>
            <p className="text">
              Visítenos en nuestra sede principal, ubicada en la zona comercial
              de mayor cobertura, Estanzuel, Los Martires, Bogota.
            </p>
            <button onClick={() => handleNavigate()} className="button">
              {' '}
              <div className="glow"></div>VER MÁS
            </button>
          </div>
          <div className="slider-image">
            <img className="image" src={suspension} alt="suspension" />
            <div className="shadow"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Slider;
