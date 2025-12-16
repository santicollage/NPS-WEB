import React, { useState, useEffect } from 'react';
import './UserInfoModal.scss';
import colombiaData from '../../data/colombia.json';
import uploadService from '../../services/upload.service';

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
  const [isUploading, setIsUploading] = useState(false);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateData = { ...formData };
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
         alert('Por favor selecciona un archivo de imagen válido');
         return;
      }

      setIsUploading(true);
      try {
        // 1. Get presigned URL
        const { url, key } = await uploadService.generatePresignedUrl(
          selectedFile.name,
          selectedFile.type
        );
        
        // 2. Upload to S3
        await uploadService.uploadFileToS3(url, selectedFile);

        // 3. Construct CloudFront URL
        const s3Url = url.split('?')[0];
        const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
        
        let finalUrl = s3Url;

        if (cloudFrontUrl) {
          // Extract the path from the S3 URL
          const urlParts = s3Url.split('.com/');
          if (urlParts.length > 1) {
             const baseUrl = cloudFrontUrl.endsWith('/') ? cloudFrontUrl.slice(0, -1) : cloudFrontUrl;
             const path = urlParts[1];
             // Add 'avif/' path and change extension
             const pathWithAvif = path.replace(/\.[^/.]+$/, ".avif");
             finalUrl = `${baseUrl}/avif/${pathWithAvif}`;
          }
        }

        updateData.image_url = finalUrl;
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        alert('Error al subir la imagen. Por favor intenta de nuevo.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
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
            <button className="btn-quartertiary" type="submit" disabled={isUploading}>
              {isUploading ? 'Subiendo...' : 'Guardar'}
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
