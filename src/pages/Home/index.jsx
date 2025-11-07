import React from 'react';
import './Home.scss';
import Slider from '../../components/Slider';
import LineGlow from '../../components/LineGlow';

const Home = () => {
  return (
    <>
      <section>
        <Slider />
      </section>
      <LineGlow orientation="horizontal" width="90%" />
      <section></section>
    </>
  );
};

export default Home;
