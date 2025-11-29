import React, { useState, useEffect } from 'react';
import './UserInfoModal.scss';
import colombiaData from '../../data/colombia.json';

const UserInfoModal = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    department: user?.department || '',
    address_line: user?.address_line || '',
    postal_code: user?.postal_code || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        department: user.department || '',
        address_line: user.address_line || '',
        postal_code: user.postal_code || '',
      });
    }
  }, [isOpen, user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const maxSize = 200;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateData = { ...formData };
    if (selectedFile) {
      try {
        const base64Image = await convertFileToBase64(selectedFile);
        updateData.image_url = base64Image;
      } catch (error) {
        console.error('Error convirtiendo imagen a base64:', error);
        return;
      }
    }
    onUpdateUser(updateData);
    onClose();
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Editar Perfil</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </label>
          <label>
            Departamento:
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  department: e.target.value,
                  city: '', // Reset city when department changes
                })
              }
            >
              <option value="">Seleccione un departamento</option>
              {Object.keys(colombiaData).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ciudad:
            <select
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              disabled={!formData.department}
            >
              <option value="">Seleccione una ciudad</option>
              {formData.department &&
                colombiaData[formData.department]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Dirección:
            <input
              type="text"
              value={formData.address_line}
              onChange={(e) =>
                setFormData({ ...formData, address_line: e.target.value })
              }
            />
          </label>
          <label>
            Código Postal:
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) =>
                setFormData({ ...formData, postal_code: e.target.value })
              }
            />
          </label>
          <label>
            Foto de Perfil:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <div className="buttons-group">
            <button className="btn-quartertiary" type="submit">
              Guardar
            </button>
            <button className="btn-secondary" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoModal;
