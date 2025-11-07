import './Footer.scss';
import { useState } from 'react';
import Phone from '../../assets/icons/PhoneIcon';
import Email from '../../assets/icons/EmailIcon';
import Location from '../../assets/icons/LocationIcon';

function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <footer>
        <h3 className="footer-title">CONTACTENOS</h3>

        <div className="footer-contact-container">
          <div className="footer-contact">
            <Phone />
            <p className="footer-text">
              3227064921 <br />
              3229713519
            </p>
          </div>

          <div className="footer-contact">
            <Email />
            <p className="footer-text">
              npsdieselsas@hotmail.com <br />
              npsdieselsas@gmail.com
            </p>
          </div>

          <div className="footer-contact">
            <Location />
            <p className="footer-text">
              Calle 7#16-60, Bogotá, Colombia <br />
              Lunes a Viernes 8:00 am a 5:00 pm <br />
              Sábados de 8:00 am a 2:00 pm
            </p>
          </div>
        </div>

        <div className="footer-terms">
          <p>
            Términos y condiciones: NPS DIESEL S.A.S garantiza productos con
            altos estándares de calidad. Garantía por defectos de fábrica por 30
            días.
          </p>
          <button className="footer-terms-button" onClick={openModal}>
            Ver términos completos
          </button>
        </div>
      </footer>

      {isModalOpen && (
        <div className="terms-modal-overlay" onClick={closeModal}>
          <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <h2>Términos y condiciones</h2>
              <button className="terms-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="terms-modal-content">
              <p>
                <strong>Fecha de última actualización:</strong> 30/10/2025
              </p>
              <p>
                Estos términos y condiciones regulan el acceso, uso y compras
                realizadas en el sitio web oficial de{' '}
                <strong>NPS DIESEL S.A.S</strong>, por lo cual se entiende que
                al realizar una compra el cliente acepta estas políticas.
              </p>

              <h3>1. Identificación de la empresa</h3>
              <ul>
                <li>
                  <strong>Razón social:</strong> NPS DIESEL S.A.S
                </li>
                <li>
                  <strong>NIT:</strong> 901061029-2
                </li>
                <li>
                  <strong>Dirección:</strong> Calle 7 #16 – 60
                </li>
                <li>
                  <strong>Teléfono de contacto:</strong> 3229713519
                </li>
                <li>
                  <strong>Correo electrónico:</strong>{' '}
                  <a href="mailto:npsdieselsas@gmail.com">
                    npsdieselsas@gmail.com
                  </a>
                </li>
              </ul>

              <h3>2. Condiciones de compra</h3>
              <ul>
                <li>
                  Todos los precios incluyen IVA, salvo que se indique lo
                  contrario.
                </li>
                <li>
                  Los productos ofrecidos están sujetos a disponibilidad de
                  inventario.
                </li>
                <li>
                  En caso de no contar con disponibilidad, se informará al
                  cliente y se procederá a devolución del dinero o a acordar un
                  cambio.
                </li>
                <li>
                  El proceso de compra sigue el flujo:{' '}
                  <strong>
                    Carrito → Checkout → Pago seguro vía Wompi → Confirmación de
                    pedido
                  </strong>
                  .
                </li>
                <li>
                  NPS DIESEL S.A.S se reserva el derecho de rechazar pedidos en
                  caso de fraude, información incompleta o incumplimiento de
                  estos términos.
                </li>
              </ul>

              <h3>3. Métodos de pago</h3>
              <p>
                Aceptamos los siguientes métodos de pago a través de la pasarela
                segura Wompi:
              </p>
              <ul>
                <li>Tarjetas de crédito y débito.</li>
                <li>PSE (débito a cuentas bancarias).</li>
                <li>
                  Pagos en efectivo a través de corresponsales autorizados
                  (Baloto, Efecty, etc.).
                </li>
                <li>Otros métodos electrónicos disponibles según Wompi.</li>
              </ul>
              <p>
                ⚠️ <strong>Nota:</strong> En ningún caso NPS DIESEL S.A.S
                almacena datos de tarjetas de crédito/débito, ya que el
                procesamiento se realiza directamente en los sistemas seguros de
                Wompi.
              </p>

              <h3>4. Políticas de envío</h3>
              <ul>
                <li>
                  Los envíos se realizan a nivel nacional mediante
                  transportadoras aliadas (ej: Coordinadora, Servientrega).
                </li>
                <li>
                  El tiempo estimado de entrega es de{' '}
                  <strong>3 a 7 días hábiles en Bogotá</strong> y de{' '}
                  <strong>5 a 10 días hábiles en otras ciudades</strong>,
                  contados a partir de la confirmación del pago.
                </li>
                <li>
                  El costo de envío será asumido por el cliente, salvo
                  promociones o compras que incluyan envío gratuito.
                </li>
                <li>
                  Una vez despachado el producto, se enviará al cliente el
                  número de guía para hacer el seguimiento del pedido.
                </li>
              </ul>

              <h3>5. Derecho de retracto y devoluciones</h3>
              <p>
                En cumplimiento de la Ley 1480 de 2011 (Estatuto del
                Consumidor), el cliente tiene derecho a{' '}
                <strong>
                  retractarse de la compra dentro de los 5 días hábiles
                  siguientes a la entrega del producto
                </strong>
                , siempre que:
              </p>
              <ul>
                <li>El producto no haya sido usado.</li>
                <li>
                  El producto conserve su empaque original, etiquetas y
                  accesorios.
                </li>
                <li>Se presente la factura de compra.</li>
              </ul>
              <p>El procedimiento será:</p>
              <ol>
                <li>
                  El cliente deberá notificar su intención de retracto al
                  correo:{' '}
                  <a href="mailto:npsdieselsas@gmail.com">
                    npsdieselsas@gmail.com
                  </a>
                  .
                </li>
                <li>
                  El cliente asumirá los costos de transporte de la devolución.
                </li>
                <li>
                  Una vez recibido el producto y verificado el estado, se
                  gestionará la devolución del dinero dentro de los siguientes
                  30 días calendario, mediante el mismo medio de pago usado en
                  la compra o mediante consignación bancaria.
                </li>
              </ol>

              <h3>6. Políticas de garantías</h3>
              <p>
                La empresa <strong>NPS DIESEL S.A.S</strong> garantiza que es
                comercializador de marcas originales y alternas en equipo
                original, cumpliendo con altos estándares de calidad.
              </p>
              <ul>
                <li>
                  Todo repuesto despachado por la empresa tiene garantía por
                  defectos de fábrica.
                </li>
                <li>
                  La garantía incluye la reparación, reposición o cambio del
                  producto o alguno de sus componentes sin cargos adicionales,
                  previa verificación técnica.
                </li>
                <li>
                  La garantía es nula si el daño se debe al desgaste normal,
                  mala manipulación, mantenimiento inadecuado o cualquier otra
                  falla atribuible al consumidor.
                </li>
                <li>
                  La garantía se otorga por{' '}
                  <strong>
                    30 días contados a partir de la instalación del producto
                  </strong>
                  , siempre que el artículo esté debidamente marcado por NPS
                  DIESEL S.A.S y cuente con todas sus partes.
                </li>
                <li>
                  El tiempo de respuesta a reclamaciones de garantía no superará
                  las{' '}
                  <strong>72 horas después de informada la situación</strong>.
                </li>
                <li>
                  Si la garantía es válida bajo parámetros de fábrica, se
                  aplicarán los tiempos establecidos por el fabricante y se
                  informará oportunamente al cliente.
                </li>
              </ul>

              <h3>7. Política de privacidad y tratamiento de datos</h3>
              <p>
                De acuerdo con la Ley 1581 de 2012, NPS DIESEL S.A.S informa
                que:
              </p>
              <ul>
                <li>
                  Los datos personales suministrados por los clientes (nombre,
                  dirección, teléfono, correo electrónico, etc.) serán
                  utilizados únicamente para fines relacionados con la compra:
                  procesamiento de pedidos, gestión de envíos, facturación y
                  contacto con el cliente.
                </li>
                <li>
                  Estos datos podrán ser compartidos con terceros como pasarelas
                  de pago (PayU) y transportadoras, únicamente con fines
                  logísticos.
                </li>
                <li>
                  El cliente podrá ejercer sus derechos de acceso, corrección o
                  eliminación de sus datos personales escribiendo al correo:{' '}
                  <a href="mailto:npsdieselsas@gmail.com">
                    npsdieselsas@gmail.com
                  </a>
                  .
                </li>
                <li>
                  NPS DIESEL S.A.S aplica medidas de seguridad para proteger la
                  información de sus clientes.
                </li>
              </ul>

              <h3>8. Atención al cliente y PQRS</h3>
              <p>
                Para solicitudes, quejas, reclamos o sugerencias, el cliente
                puede contactarnos en:
              </p>
              <ul>
                <li>
                  Correo:{' '}
                  <a href="mailto:npsdieselsas@gmail.com">
                    npsdieselsas@gmail.com
                  </a>
                </li>
                <li>Teléfono: 3229713519</li>
                <li>
                  Horario de atención: Lunes a viernes de 8:00 am a 6:00 pm
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
