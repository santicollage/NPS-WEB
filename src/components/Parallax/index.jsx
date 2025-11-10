import React, { useEffect, useState } from 'react';
import './Parallax.scss';
import Sky from '../../assets/images/parallax/sky.png';
import Road from '../../assets/images/parallax/road.png';
import Truck from '../../assets/images/parallax/truck.png';
import Logo from '../../assets/images/logo-nps.png';
import LineGlow from '../LineGlow';
import { useWindowWidth } from '../../hooks/useWindowWidth';

function Parallax() {
  const [offsetY, setOffsetY] = useState(0);

  const windowWidth = useWindowWidth();

  const handleScroll = () => setOffsetY(window.scrollY);

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="parallax" onClick={scrollDown}>
        <img
          src={Sky}
          alt="Cielo"
          className="layer sky"
          style={{ transform: `translateY(${offsetY * 0.2}px)` }}
        />
        <img
          src={Road}
          alt="Carretera"
          className="layer road"
          style={{ transform: `translateY(${offsetY * 0.5}px)` }}
        />
        <img
          src={Truck}
          alt="Camión"
          className="layer truck"
          style={{
            transform: `translateY(${offsetY * 0.3}px) translateX(-50%)`,
          }}
        />
        <div
          className="text"
          style={{
            transform: `${windowWidth > 768 ? `translateY(${offsetY * -0.3}px) translateX(-50%)` : `translateY(${offsetY * 0.3}px) translateX(-50%)`} `,
          }}
        >
          <img
            src={Logo}
            alt="NPS Diesel"
            className="logo"
            style={{
              transform: `translateX(${offsetY * -0.3}px)`,
            }}
          />
          <div
            className="phrase-container"
            style={{
              transform: `translateX(${offsetY * 0.3}px)`,
            }}
          >
            <p>Calidad que impulsa kilómetros de confianza</p>
            <LineGlow orientation="horizontal" width="100%" />
          </div>
        </div>
      </div>
      <div className="bottom-fade" onClick={scrollDown}></div>
    </>
  );
}

export default Parallax;
