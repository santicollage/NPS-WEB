import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectOrders,
  selectOrdersError,
} from '../../store/slices/orderSelectors';
import { fetchOrders } from '../../store/slices/orderSlice';
import OrderDetailsModal from './OrderDetailsModal';
import PaymentModal from '../PaymentModal';
import './UserOrders.scss';

const UserOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const error = useSelector(selectOrdersError);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderToPay, setOrderToPay] = useState(null);

  console.log(orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="user-orders">
      <h2>Mis Pedidos</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : !orders || orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.status}</td>
                <td>${order.total_amount}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setModalOpen(true);
                      }}
                      className="details-button"
                    >
                      Ver Detalles
                    </button>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => {
                          setOrderToPay(order);
                          setIsPaymentModalOpen(true);
                        }}
                        className="pay-button"
                      >
                        Pagar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <OrderDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={orderToPay}
      />
    </div>
  );
};

export default UserOrders;
