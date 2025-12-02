import React from 'react';
import './Home.scss';
import Slider from '../../components/Slider';
import LineGlow from '../../components/LineGlow';
import Benefits from '../../components/Benefits';
import MapNps from '../../components/MapNps';
import Parallax from '../../components/Parallax';
import SEO from '../../components/SEO/SEO';

const Home = () => {
  return (
    <>
      <SEO 
        title="Inicio" 
        description="Bienvenido a NPS ECOMMERCE, tu destino número uno para componentes de transporte pesado de alta calidad. Encuentra las mejores piezas y repuestos."
        keywords="transporte pesado, repuestos camiones, componentes vehiculos, nps ecommerce, tienda repuestos, chevrolet, ford, NPR, NQR"
      />
      <section className="section-parallax">
        <Parallax />
      </section>
      <section>
        <Slider />
      </section>
      <LineGlow orientation="horizontal" width="90%" />
      <section>
        <Benefits />
      </section>
      <section>
        <MapNps />
      </section>
    </>
  );
};

export default Home;
