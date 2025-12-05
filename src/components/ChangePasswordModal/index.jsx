import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../store/slices/userSlice';
import { selectCurrentUser } from '../../store/slices/userSelectors';
import './ChangePasswordModal.scss';
import CloseIcon from '../../assets/icons/CloseIcon';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.current_password) {
      newErrors.current_password = 'La contraseña actual es requerida';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'La nueva contraseña es requerida';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'La nueva contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Debe confirmar la nueva contraseña';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        changePassword({
          userId: currentUser.user_id,
          passwordData: {
            current_password: formData.current_password,
            new_password: formData.new_password,
          },
        })
      ).unwrap();

      setSuccessMessage('Contraseña cambiada exitosamente');
      
      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setServerError(
        err.error?.message || err.message || 'Error al cambiar la contraseña'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setErrors({});
    setServerError(null);
    setSuccessMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="password-modal-overlay" onClick={handleClose}>
      <div className="password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cambiar Contraseña</h2>
          <button className="close-btn" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="current_password">Contraseña Actual</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña actual"
                disabled={isSubmitting}
              />
              {errors.current_password && (
                <span className="error-message">{errors.current_password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="new_password">Nueva Contraseña</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Ingrese su nueva contraseña"
                disabled={isSubmitting}
              />
              {errors.new_password && (
                <span className="error-message">{errors.new_password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirme su nueva contraseña"
                disabled={isSubmitting}
              />
              {errors.confirm_password && (
                <span className="error-message">{errors.confirm_password}</span>
              )}
            </div>

            {serverError && (
              <div className="server-error">{serverError}</div>
            )}

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="cancel-btn btn-secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default ChangePasswordModal;
