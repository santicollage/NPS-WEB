import './About.scss';
import Objectives from '../../components/Objectives';
import History from '../../components/History';
import MapNps from '../../components/MapNps';

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
        <MapNps />
      </section>
    </>
  );
}

export default About;
