import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import {
  loginUser,
  registerUser,
  loginWithGoogle,
  clearStatus,
} from '../../store/slices/userSlice';
import EyeIcon from '../../assets/icons/EyeIcon';
import EyeOffIcon from '../../assets/icons/EyeOffIcon';
import './Login.scss';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.user);

  useEffect(() => {
    if (success) {
      dispatch(clearStatus());
    }
  }, [success, dispatch]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    dispatch(clearStatus());
  };

  const validateField = (name, value) => {
    if (!touched[name]) return;
    let error = '';
    if (name === 'email') {
      if (!value) error = 'El email es requerido';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email inválido';
    } else if (name === 'password') {
      if (!value) error = 'La contraseña es requerida';
    } else if (name === 'name' && !isLogin) {
      if (!value) error = 'El nombre es requerido';
    } else if (name === 'confirmPassword' && !isLogin) {
      if (!value) error = 'Confirmar contraseña es requerido';
      else if (value !== formData.password)
        error = 'Las contraseñas no coinciden';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (touched.email) {
      if (!formData.email) newErrors.email = 'El email es requerido';
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = 'Email inválido';
    }
    if (touched.password) {
      if (!formData.password) newErrors.password = 'La contraseña es requerida';
    }
    if (!isLogin) {
      if (touched.name) {
        if (!formData.name) newErrors.name = 'El nombre es requerido';
      }
      if (touched.confirmPassword) {
        if (!formData.confirmPassword)
          newErrors.confirmPassword = 'Confirmar contraseña es requerido';
        else if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    setErrors(newErrors);
    // isFormValid checks all required fields, not just touched
    const allErrors = {};
    if (!formData.email) allErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      allErrors.email = 'Email inválido';
    if (!formData.password) allErrors.password = 'La contraseña es requerida';
    if (!isLogin) {
      if (!formData.name) allErrors.name = 'El nombre es requerido';
      if (!formData.confirmPassword)
        allErrors.confirmPassword = 'Confirmar contraseña es requerido';
      else if (formData.password !== formData.confirmPassword)
        allErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setIsFormValid(Object.keys(allErrors).length === 0);
  }, [formData, isLogin, touched]);

  useEffect(() => {
    validateForm();
  }, [formData, isLogin, validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
    if (name === 'password' && !isLogin) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    const data = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
    dispatch(isLogin ? loginUser(data) : registerUser(data));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(loginWithGoogle({ token: credentialResponse.credential }));
  };

  const handleGoogleError = () => {
    console.error('Error al iniciar sesión con Google');
  };

  return (
    <div className="login-container">
      <motion.div className="login-card" layout>
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="form-wrapper"
            >
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <div className="input-container">
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>
                <div className="input-group">
                  <div className="input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error">{errors.password}</span>
                  )}
                </div>
                <button type="submit" disabled={loading || !isFormValid}>
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  className="google-btn-container"
                />
              </form>
              <p>
                ¿No tienes cuenta?{' '}
                <a href="#" onClick={handleToggle}>
                  Regístrate aquí
                </a>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="form-wrapper"
            >
              <h2>Crear Cuenta</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <div className="input-container">
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="input-group">
                  <div className="input-container">
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>
                <div className="input-group">
                  <div className="input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error">{errors.password}</span>
                  )}
                </div>
                <div className="input-group">
                  <div className="input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error">{errors.confirmPassword}</span>
                  )}
                </div>
                <button type="submit" disabled={loading || !isFormValid}>
                  {loading ? 'Cargando...' : 'Crear cuenta'}
                </button>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  className="google-btn-container"
                />
              </form>
              <p>
                ¿Ya tienes cuenta?{' '}
                <a href="#" onClick={handleToggle}>
                  Inicia sesión aquí
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {error && <div className="global-error">{error}</div>}
      </motion.div>
    </div>
  );
};

export default Login;
