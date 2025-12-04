import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../../store/slices/productSlice';
import {
  fetchCategories,
  deleteCategory,
} from '../../store/slices/categorySlice';
import { selectCategories } from '../../store/slices/categorySelectors';
import './ProductFormModal.scss';
import CloseIcon from '../../assets/icons/CloseIcon';
import CategoryFormModal from '../CategoryFormModal';
import AddIcon from '../../assets/icons/AddProductIcon';
import RemoveIcon from '../../assets/icons/RemoveIcon';

const sizeSpecs = {
  extra_small: { width: 5, height: 5, length: 5, weight: 0.2 },
  small: { width: 10, height: 10, length: 10, weight: 1 },
  medium: { width: 15, height: 15, length: 15, weight: 2 },
  large: { width: 20, height: 20, length: 20, weight: 5 },
  extra_large: { width: 30, height: 30, length: 30, weight: 10 },
};

const ProductFormModal = ({ isOpen, onClose, productToEdit = null }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    price: '',
    stock_quantity: '',
    description: '',
    category_ids: [],
    images: [''],
    visible: true,
    size: '',
  });

  // Validation Logic
  useEffect(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.stock_quantity || Number(formData.stock_quantity) < 0)
      newErrors.stock_quantity = 'El stock no puede ser negativo';

    const validImages = formData.images.filter((img) => {
      if (typeof img === 'string') return img.trim() !== '';
      return img instanceof File;
    });
    if (validImages.length === 0)
      newErrors.images = 'Debe agregar al menos una imagen';

    if (formData.category_ids.length === 0)
      newErrors.categories = 'Debe seleccionar al menos una categoría';

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (productToEdit) {
      const categoryIds =
        productToEdit.categories?.map((cat) => cat.category_id) || [];
      setFormData({
        name: productToEdit.name || '',
        reference: productToEdit.reference || '',
        price: productToEdit.price || '',
        stock_quantity: productToEdit.stock_quantity || '',
        description: productToEdit.description || '',
        category_ids: categoryIds,
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
        category_ids: [],
        images: [''],
        visible: true,
        size: 'extra_small',
      });
    }
  }, [productToEdit, isOpen]);

  // Clear errors and touched fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      setServerError(null);
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const maxSize = 800; // Increased max size for product images
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };
      img.onerror = (error) => reject(error);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => {
      const isSelected = prev.category_ids.includes(categoryId);
      return {
        ...prev,
        category_ids: isSelected
          ? prev.category_ids.filter((id) => id !== categoryId)
          : [...prev.category_ids, categoryId],
      };
    });
  };

  const handleDeleteCategory = (categoryId) => {
    // Remove from formData if selected
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.filter((id) => id !== categoryId),
    }));
    // Dispatch delete action
    dispatch(deleteCategory(categoryId));
  };

  const handleCategoryCreated = (newCategory) => {
    // Refresh categories
    dispatch(fetchCategories());
    // Auto-select the newly created category
    setFormData((prev) => ({
      ...prev,
      category_ids: [...prev.category_ids, newCategory.category_id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Process images: convert files to base64, keep existing URLs
    const processedImages = await Promise.all(
      formData.images.map(async (img) => {
        if (img instanceof File) {
          return await convertFileToBase64(img);
        }
        return img;
      })
    );

    const payload = {
      name: formData.name,
      reference: formData.reference,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      description: formData.description,
      category_ids: formData.category_ids.map((id) => Number(id)),
      image_urls: processedImages.filter((img) => img && typeof img === 'string' && img.trim() !== ''),
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
      // Extract error message from the response
      const errorMessage =
        error?.error?.message ||
        error?.message ||
        'Error al guardar el producto';
      setServerError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-form-modal-overlay" onClick={onClose}>
      <div className="product-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</h2>
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
                onBlur={handleBlur}
                required
              />
              {touched.name && errors.name && (
                <span className="error-text">{errors.name}</span>
              )}
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
              <label>Precio *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                min="0"
              />
              {touched.price && errors.price && (
                <span className="error-text">{errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label>Tamaño del producto *</label>
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
              <label>Stock *</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                min="0"
              />
              {touched.stock_quantity && errors.stock_quantity && (
                <span className="error-text">{errors.stock_quantity}</span>
              )}
            </div>

            <div className="form-group full-width">
              <div className="category-header">
                <label>Categorías *</label>
                <button
                  type="button"
                  className="btn-create-category"
                  onClick={() => setIsCategoryModalOpen(true)}
                >
                  <AddIcon /> Crear Categoría
                </button>
              </div>
              <div className="category-checkboxes">
                {categories.map((cat) => (
                  <label
                    key={cat.category_id}
                    className="category-checkbox-label"
                  >
                    <div className="category-left">
                      <input
                        type="checkbox"
                        checked={formData.category_ids.includes(
                          cat.category_id
                        )}
                        onChange={() => handleCategoryToggle(cat.category_id)}
                      />
                      <span>{cat.name}</span>
                    </div>
                    <button
                      type="button"
                      className="category-delete-btn"
                      onClick={() => handleDeleteCategory(cat.category_id)}
                      title="Eliminar categoría"
                    >
                      <RemoveIcon />
                    </button>
                  </label>
                ))}
              </div>
              {errors.categories && (
                <span className="error-text">{errors.categories}</span>
              )}
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

            <div className="images-section">
              <h3>
                Imágenes{' '}
                {errors.images && (
                  <span
                    className="error-text"
                    style={{ fontSize: '0.8rem', marginLeft: '10px' }}
                  >
                    {errors.images}
                  </span>
                )}
              </h3>
              <div className="image-inputs">
                {formData.images.map((img, index) => (
                  <div key={index} className="image-input-row">
                    {/* If it's a string (URL) and not empty, show preview or link */}
                    {typeof img === 'string' && img !== '' ? (
                      <div className="image-preview-container">
                        <img src={img} alt={`Preview ${index}`} className="image-preview-thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                        <span className="image-url-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px', display: 'inline-block' }}>{img}</span>
                      </div>
                    ) : (
                      // If it's a File object or empty string, show file input
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                      />
                    )}
                    
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
          <button
            type="button"
            className="cancel-btn btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!isFormValid}
            style={{
              opacity: !isFormValid ? 0.5 : 1,
              cursor: !isFormValid ? 'not-allowed' : 'pointer',
            }}
          >
            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </div>

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
};

export default ProductFormModal;
