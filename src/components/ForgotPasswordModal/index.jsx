import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearStatus } from '../../store/slices/userSlice';
import './ForgotPasswordModal.scss';
import CloseIcon from '../../assets/icons/CloseIcon';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [localSuccess, setLocalSuccess] = useState(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleClose = () => {
    dispatch(clearStatus());
    setEmail('');
    setLocalSuccess(null);
    onClose();
  };

  useEffect(() => {
    if (localSuccess) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [localSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then((payload) => {
        setLocalSuccess(payload.message || 'If the email exists, a password reset link has been sent.');
      })
      .catch((err) => {
        console.error('Failed to send reset email:', err);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-modal-overlay">
      <div className="forgot-password-modal">
        <button className="close-btn" onClick={handleClose}>
          <CloseIcon />
        </button>
        <h3>Recuperar Contraseña</h3>
        
        {!localSuccess ? (
          <>
            <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            {error && <div className="status-message error">{typeof error === 'object' ? error.message : error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Correo'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="status-message success">
              {localSuccess}
            </div>
            <p>Revisa tu bandeja de entrada (y spam) para continuar con el proceso.</p>
            <div className="modal-actions">
              <button type="button" className="submit-btn" onClick={handleClose}>
                Entendido
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
