import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearStatus } from '../../store/slices/userSlice';
import EyeIcon from '../../assets/icons/EyeIcon';
import EyeOffIcon from '../../assets/icons/EyeOffIcon';
import SEO from '../../components/SEO/SEO';
import './ResetPassword.scss';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, success } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    if (!token) {
      setValidationError('Token inválido o faltante');
      return;
    }

    dispatch(resetPassword({ token, newPassword: formData.password }));
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="status-message error">
            El enlace ya no es válido, solicita uno nuevo.
          </div>
          <button 
              type="button" 
              onClick={() => navigate('/login')}
              style={{
                  marginTop: '1rem',
                  padding: '0.8rem',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer'
              }}
          >
              Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <SEO 
        title="Restablecer Contraseña" 
        description="Restablece tu contraseña de NPS ECOMMERCE."
        keywords="reset password, contraseña, recuperar cuenta"
      />
      <div className="reset-password-card">
        <h2>Nueva Contraseña</h2>
        
        {success ? (
          <div className="status-message success">
            {success}. Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Nueva contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {validationError && <span className="error">{validationError}</span>}
            </div>

            {error && (
              <div className="status-message error">
                {typeof error === 'object' ? error.message : error}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
