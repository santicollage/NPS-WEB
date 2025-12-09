import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPayment,
  clearStatus as clearPaymentStatus,
} from '../../store/slices/paymentSlice';
import { selectIsAuthenticated, selectCurrentUser } from '../../store/slices/userSelectors';
import { selectGuestCart } from '../../store/slices/cartSelectors';
import './PaymentModal.scss';

import payuLogo from '../../assets/images/checkout/payu.avif';


const PaymentModal = ({ isOpen, onClose, order }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const guestCart = useSelector(selectGuestCart);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return price.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleConfirmPayment = async () => {
    if (!order) return;
    setIsProcessing(true);
    dispatch(clearPaymentStatus());

    try {
      const paymentPayload = {
        order_id: order.order_id,
        ...(isAuthenticated ? {} : { guest_id: guestCart?.guest_id }),
      };

      const resultAction = await dispatch(createPayment(paymentPayload));

      if (createPayment.fulfilled.match(resultAction)) {
        const { payu_checkout_url } = resultAction.payload;
        if (payu_checkout_url) {
          window.location.href = payu_checkout_url;
        } else {
          alert('No se recibió la URL de pago');
        }
      } else {
        alert(resultAction.payload?.error || 'Error al iniciar el pago');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Ocurrió un error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <h2>Confirmar Pago</h2>
        <div className="modal-content">
          <p>Su orden ha sido creada exitosamente.</p>
          <p>Valor a pagar:</p>
          <div className="amount-to-pay">
            ${formatPrice(order.total_amount || 0)}
          </div>
          <p>
            ¿Desea proceder al pago por medio de PayU?
            <img src={payuLogo} alt="PayU" />
          </p>
          <div className="payment-methods">
            <img className="nequi" src="/images/checkout/nequi.avif" alt="Nequi" loading="lazy" />
            <img className="pse" src="/images/checkout/pse.avif" alt="PSE" loading="lazy" />
            <img className="visa" src="/images/checkout/visa.avif" alt="Visa" loading="lazy" />
            <img className="bancolombia" src="/images/checkout/bancolombia.avif" alt="Bancolombia" loading="lazy" />
          </div>
        </div>
        <div className="modal-actions">
          <button
            className="cancel-button btn-secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            className="confirm-button"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Redirigiendo...' : 'Pagar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
