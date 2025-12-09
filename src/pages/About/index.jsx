import React, { lazy, Suspense } from 'react';
import './About.scss';
import Objectives from '../../components/Objectives';
import History from '../../components/History';

// Lazy load Google Maps component to improve initial load performance
const MapNps = lazy(() => import('../../components/MapNps'));

function About() {
  return (
    <>
      <h1 className="us-title">NOSOTROS</h1>

      <section>
        <Objectives />
      </section>
      <section>
        <History />
      </section>
      <section>
        <Suspense fallback={<div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando mapa...</div>}>
          <MapNps />
        </Suspense>
      </section>
    </>
  );
}

export default About;
