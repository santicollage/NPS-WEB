import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCart,
  selectGuestCart,
} from '../../store/slices/cartSelectors';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/userSelectors';
import {
  createOrder,
  createGuestOrder,
  clearStatus as clearOrderStatus,
} from '../../store/slices/orderSlice';
import {
  clearStatus as clearPaymentStatus,
} from '../../store/slices/paymentSlice';
import './Checkout.scss';
import PaymentModal from '../../components/PaymentModal';

import colombiaData from '../../data/colombia.json';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const cart = useSelector(selectCart);
  const guestCart = useSelector(selectGuestCart);
  
  const currentCart = isAuthenticated ? cart : guestCart;
  const items = currentCart?.items || [];
  const shippingCost = parseFloat(currentCart?.shipping_cost) || 0;

  // Local State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    document: '',
    email: '',
    address: '',
    description: '',
    department: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pre-fill data for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      const [firstName, ...lastNameParts] = (user.name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        department: user.department || '',
        address: user.address_line || '',
        postalCode: user.postal_code || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!currentCart || items.length === 0) {
      navigate('/');
    }
  }, [currentCart, items, navigate]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (value.trim().length < 3) {
          error = 'Debe tener al menos 3 caracteres';
        }
        break;
      case 'document':
        if (value.trim().length < 6) {
          error = 'Debe tener al menos 6 caracteres';
        }
        break;
      case 'address':
        if (value.trim().length < 10) {
          error = 'Debe tener al menos 10 caracteres';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = 'Correo electrónico inválido';
        }
        break;
      case 'phone':
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          error = 'Debe tener 10 dígitos numéricos';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'department') {
      setFormData((prev) => ({
        ...prev,
        department: value,
        city: '', // Reset city when department changes
      }));
      if (touched.department) {
        const error = validateField('department', value);
        setErrors((prev) => ({ ...prev, department: error }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const isFormValid = () => {
    const {
      firstName,
      lastName,
      document,
      email,
      address,
      department,
      city,
      phone,
    } = formData;

    const hasErrors = Object.values(errors).some((error) => error !== '');
    const hasEmptyFields =
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      document.trim() === '' ||
      email.trim() === '' ||
      address.trim() === '' ||
      department.trim() === '' ||
      city.trim() === '' ||
      phone.trim() === '';

    return !hasErrors && !hasEmptyFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched to show initial errors
    const newTouched = {};
    const newErrors = {};
    for (const key in formData) {
      newTouched[key] = true;
      newErrors[key] = validateField(key, formData[key]);
    }
    setTouched(newTouched);
    setErrors(newErrors);

    if (!isFormValid()) return;
    
    setIsProcessing(true);
    dispatch(clearOrderStatus());

    const orderPayload = {
      customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_document: formData.document,
      department: formData.department,
      city: formData.city,
      address_line: formData.address,
      postal_code: formData.postalCode,
    };

    try {
      let resultAction;
      if (isAuthenticated) {
        resultAction = await dispatch(createOrder(orderPayload));
      } else {
        resultAction = await dispatch(
          createGuestOrder({
            ...orderPayload,
            guest_id: guestCart?.guest_id,
          })
        );
      }

      if (createOrder.fulfilled.match(resultAction) || createGuestOrder.fulfilled.match(resultAction)) {
        setCreatedOrder(resultAction.payload);
        setIsModalOpen(true);
      } else {
        alert(resultAction.payload?.error || 'Error al crear la orden');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ocurrió un error inesperado');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-form-container">
        <h2>Datos de Envío</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={touched.firstName && errors.firstName ? 'invalid' : ''}
                required
              />
              {touched.firstName && errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={touched.lastName && errors.lastName ? 'invalid' : ''}
                required
              />
              {touched.lastName && errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>CC ó NIT</label>
            <input
              type="text"
              name="document"
              value={formData.document}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={touched.document && errors.document ? 'invalid' : ''}
              required
            />
            {touched.document && errors.document && (
              <span className="error-message">{errors.document}</span>
            )}
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'invalid' : ''}
              required
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={touched.address && errors.address ? 'invalid' : ''}
              required
            />
            {touched.address && errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Departamento</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={touched.department && errors.department ? 'invalid' : ''}
                required
              >
                <option value="">Seleccione un departamento</option>
                {Object.keys(colombiaData).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {touched.department && errors.department && (
                <span className="error-message">{errors.department}</span>
              )}
            </div>
            <div className="form-group">
              <label>Ciudad</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                disabled={!formData.department}
                className={touched.city && errors.city ? 'invalid' : ''}
              >
                <option value="">Seleccione una ciudad</option>
                {formData.department &&
                  colombiaData[formData.department]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
              {touched.city && errors.city && (
                <span className="error-message">{errors.city}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Código Postal (Opcional)</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={touched.postalCode && errors.postalCode ? 'invalid' : ''}
              />
              {touched.postalCode && errors.postalCode && (
                <span className="error-message">{errors.postalCode}</span>
              )}
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={touched.phone && errors.phone ? 'invalid' : ''}
                required
              />
              {touched.phone && errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="order-summary-container">
        <h2>Resumen del Pedido</h2>
        <div className="summary-items">
          {items.map((item) => (
            <div key={item.cart_item_id} className="summary-item">
              <img
                src={item.product.images?.[0] || ''}
                alt={item.product.name}
              />
              <div className="item-info">
                <h4>{item.product.name}</h4>
                <p>{item.product.reference}</p>
              </div>
              <div className="item-quantity">{item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="summary-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>${formatPrice(calculateSubtotal())}</span>
          </div>
          <div className="total-row">
            <span>Envío</span>
            <span>${formatPrice(shippingCost)}</span>
          </div>
          <div className="total-row final-total">
            <span>Total</span>
            <span>${formatPrice(calculateTotal())}</span>
          </div>
        </div>

        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={isProcessing || !isFormValid()}
        >
          {isProcessing ? 'Procesando...' : 'Confirmar Orden'}
        </button>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate('/profile');
        }}
        order={createdOrder}
      />
    </div>
  );
};

export default Checkout;
