import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCategory } from '../../store/slices/categorySlice';
import './CategoryFormModal.scss';
import CloseIcon from '../../assets/icons/CloseIcon';

const CategoryFormModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await dispatch(createCategory(formData)).unwrap();
      // Notify parent that category was created
      if (onCategoryCreated) {
        onCategoryCreated(result);
      }
      // Reset form and close
      setFormData({ name: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error?.error?.message || error?.message || 'Error al crear categoría';
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="category-form-modal-overlay" onClick={onClose}>
      <div className="category-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Nueva Categoría</h2>
          <button className="close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {serverError && (
          <div className="server-error-alert">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{serverError}</span>
            <button 
              className="close-error-btn" 
              onClick={() => setServerError(null)}
              type="button"
            >
              ×
            </button>
          </div>
        )}

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Electrónica"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción opcional de la categoría"
                rows="3"
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-btn btn-primary" 
            onClick={handleSubmit}
            disabled={!formData.name.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Categoría'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
