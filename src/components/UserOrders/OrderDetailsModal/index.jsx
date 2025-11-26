import React from 'react';
import './OrderDetailsModal.scss';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>
        <h3>Detalles del Pedido #{order.order_id}</h3>
        <div className="modal-content">
          <div className="order-info">
            <p>
              <strong>Cliente:</strong> {order.customer_name || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {order.customer_email || 'N/A'}
            </p>
            <p>
              <strong>Teléfono:</strong> {order.customer_phone || 'N/A'}
            </p>
            <p>
              <strong>Documento:</strong> {order.customer_document || 'N/A'}
            </p>
            <p>
              <strong>Dirección:</strong> {order.address_line || 'N/A'},{' '}
              {order.city}, {order.department}
            </p>
            <p>
              <strong>Código Postal:</strong> {order.postal_code || 'N/A'}
            </p>
            <p>
              <strong>Estado:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ${order.total_amount}
            </p>
            <p>
              <strong>Costo de Envío:</strong> ${order.shipping_cost}
            </p>
            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="order-items">
            <h4>Productos</h4>
            <ul>
              {order.items.map((item) => (
                <li key={item.order_item_id}>
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="item-image"
                    />
                  ) : (
                    <div className="item-image" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>Sin img</div>
                  )}
                  <div className="item-details">
                    <p>
                      <strong>Producto:</strong> {item.product.name}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {item.product.description}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Precio Unitario:</strong> ${item.unit_price}
                    </p>
                    <p>
                      <strong>Subtotal:</strong> ${item.subtotal}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-payments">
            <h4>Pagos</h4>
            {order.payments.length > 0 ? (
              <ul>
                {order.payments.map((payment, index) => (
                  <li key={index}>
                    {/* Asumiendo estructura de payment, ajustar si necesario */}
                    <p>Detalles del pago aquí</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay pagos registrados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
