import React from 'react';
import './Home.scss';
import Slider from '../../components/Slider';
import LineGlow from '../../components/LineGlow';
import Benefits from '../../components/Benefits';
import MapNps from '../../components/MapNps';
import Parallax from '../../components/Parallax';

const Home = () => {
  return (
    <>
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
