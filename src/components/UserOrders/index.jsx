import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders } from '../../store/slices/orderSelectors';
import { fetchOrders } from '../../store/slices/orderSlice';
import './UserOrders.scss';

const UserOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="user-orders">
      <h2>Mis Pedidos</h2>
      {!Array.isArray(orders) ? (
        <p>Error al cargar pedidos.</p>
      ) : orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>
                <strong>ID del Pedido:</strong> {order.id}
              </p>
              <p>
                <strong>Estado:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>
              <p>
                <strong>Fecha:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              {/* Agregar más detalles según sea necesario */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
