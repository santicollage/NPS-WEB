import React, { useEffect, useState } from 'react';
import './Parallax.scss';

import LineGlow from '../LineGlow';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import Benefits1Icon from '../../assets/icons/Benefits1Icon';

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
          src="/images/parallax/sky.avif"
          alt="Cielo"
          className="layer sky"
          style={{ transform: `translateY(${offsetY * 0.2}px)` }}
          loading="lazy"
        />
        <img
          src="/images/parallax/road.avif"
          alt="Carretera"
          className="layer road"
          style={{ transform: `translateY(${offsetY * 0.5}px)` }}
          loading="lazy"
        />
        <img
          src="/images/parallax/truck.avif"
          alt="Camión"
          className="layer truck"
          style={{
            transform: `translateY(${offsetY * 0.3}px) translateX(-50%)`,
          }}
          fetchpriority="high"
        />
        <div
          className="text"
          style={{
            transform: `${windowWidth > 768 ? `translateY(${offsetY * -0.3}px) translateX(-50%)` : `translateY(${offsetY * 0.3}px) translateX(-50%)`} `,
          }}
        >
          <img
            src="/images/logo-nps.avif"
            alt="NPS Diesel"
            className="logo"
            style={{
              transform: `translateX(${offsetY * -0.3}px)`,
            }}
            loading="lazy"
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
          <p className="phrase phrase-top">
            Comercializadora de repuestos diésel
          </p>
          <p className="phrase phrase-left">Desempeño</p>
          <p className="phrase phrase-rigth">
            {' '}
            <Benefits1Icon /> 4°35'59"N - 74°05'10"W
          </p>
        </div>
      </div>
      <div className="bottom-fade" onClick={scrollDown}></div>
    </>
  );
}

export default Parallax;
