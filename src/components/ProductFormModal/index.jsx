import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../../store/slices/productSlice';
import './ProductFormModal.scss';

const sizeSpecs = {
  extra_small: { width: 5, height: 5, length: 5, weight: 0.2 },
  small: { width: 10, height: 10, length: 10, weight: 1 },
  medium: { width: 15, height: 15, length: 15, weight: 2 },
  large: { width: 20, height: 20, length: 20, weight: 5 },
  extra_large: { width: 30, height: 30, length: 30, weight: 10 },
};

const ProductFormModal = ({ isOpen, onClose, productToEdit = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    price: '',
    stock_quantity: '',
    description: '',
    category_id: '',
    images: [''],
    visible: true,
    size: '',
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        reference: productToEdit.reference || '',
        price: productToEdit.price || '',
        stock_quantity: productToEdit.stock_quantity || '',
        description: productToEdit.description || '',
        category_id: productToEdit.categories?.[0]?.category_id || '',
        images: productToEdit.images?.length ? productToEdit.images : [''],
        visible: productToEdit.visible ?? true,
        size: productToEdit.size || 'extra_small',
      });
    } else {
      setFormData({
        name: '',
        reference: '',
        price: '',
        stock_quantity: '',
        description: '',
        category_id: '',
        images: [''],
        visible: true,
        size: 'extra_small',
      });
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      reference: formData.reference,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      description: formData.description,
      category_ids: [Number(formData.category_id)],
      image_urls: formData.images.filter((img) => img.trim() !== ''),
      size: formData.size,
      visible: formData.visible,
    };

    try {
      if (productToEdit) {
        await dispatch(
          updateProduct({
            productId: productToEdit.product_id,
            updateData: payload,
          })
        ).unwrap();
      } else {
        await dispatch(createProduct(payload)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      // Handle error (show toast, etc.)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-form-modal-overlay" onClick={onClose}>
      <div className="product-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Referencia</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Tamaño del producto</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                {Object.entries(sizeSpecs).map(([key, specs]) => {
                  const label = key
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  const specsText = `(${specs.width}cm x ${specs.height}cm x ${specs.length}cm x ${specs.weight}kg)`;
                  return (
                    <option key={key} value={key}>
                      {label} {specsText}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Categoría (ID)</label>
              <input
                type="number"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="visible"
                  checked={formData.visible}
                  onChange={handleChange}
                />
                Visible en tienda
              </label>
            </div>

            <div className="images-section">
              <h3>Imágenes (URLs)</h3>
              <div className="image-inputs">
                {formData.images.map((img, index) => (
                  <div key={index} className="image-input-row">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-image-btn"
                  onClick={addImageField}
                >
                  + Agregar otra imagen
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
