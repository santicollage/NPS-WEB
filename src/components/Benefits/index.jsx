import './Benefits.scss';
import Benefits1Icon from '../../assets/icons/Benefits1Icon';
import Benefits2Icon from '../../assets/icons/Benefits2Icon';
import Benefits3Icon from '../../assets/icons/Benefits3Icon';
import Benefits4Icon from '../../assets/icons/Benefits4Icon';
import benefits1 from '../../assets/images/benefits/benefits-1.png';
import benefits2 from '../../assets/images/benefits/benefits-2.png';
import benefits3 from '../../assets/images/benefits/benefits-3.png';
import benefits4 from '../../assets/images/benefits/benefits-4.png';

function Benefits() {
  const benefits = [
    {
      id: 1,
      icon: Benefits1Icon,
      image: benefits1,
      title: 'Trayectoria y confianza',
      description:
        'Amplia experiencia en la distribución de repuestos originales y homologados de alta calidad, respaldada por alianzas con empresas de transporte público a nivel urbano y nacional.',
    },
    {
      id: 2,
      icon: Benefits2Icon,
      image: benefits2,
      title: 'Variedad y calidad',
      description:
        'Extenso catálogo de repuestos que se adaptan a diferentes necesidades y presupuestos, siempre garantizando estándares de excelencia.',
    },
    {
      id: 3,
      icon: Benefits3Icon,
      image: benefits3,
      title: 'Cobertura nacional',
      description:
        'Ofrecemos envíos rápidos y seguros a nivel urbano y nacional, garantizando que los productos lleguen en el menor tiempo posible.',
    },
    {
      id: 4,
      icon: Benefits4Icon,
      image: benefits4,
      title: 'Servicio profesional',
      description:
        'Un equipo altamente calificado que brinda soluciones rápidas y eficaces a las necesidades de nuestros clientes.',
    },
  ];

  return (
    <div className="benefits-container">
      <h2 className="benefits-title">POR QUÉ ELEGIRNOS</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => {
          const IconComponent = benefit.icon;
          return (
            <div
              className={`benefits-subgrid ${index % 2 === 0 ? 'even' : 'odd'}`}
            >
              <div className="benefit-image">
                <img src={benefit.image} alt={benefit.title} />
              </div>
              <div key={benefit.id} className="benefit-card">
                <div className="benefit-icon">
                  <IconComponent />
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Benefits;
