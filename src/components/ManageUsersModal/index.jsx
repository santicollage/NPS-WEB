import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole } from '../../store/slices/userSlice';
import {
  selectUsersList,
  selectUsersTotal,
  selectUsersLoading,
  selectUsersError,
} from '../../store/slices/userSelectors';
import './ManageUsersModal.scss';
import CloseIcon from '../../assets/icons/CloseIcon';

const ManageUsersModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const usersList = useSelector(selectUsersList);
  const usersTotal = useSelector(selectUsersTotal);
  const usersLoading = useSelector(selectUsersLoading);
  const usersError = useSelector(selectUsersError);

  // Local state for input values
  const [searchInput, setSearchInput] = useState('');
  const [roleFilterInput, setRoleFilterInput] = useState('');
  
  // Applied filters (what's actually sent to API)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedRoleFilter, setAppliedRoleFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const limit = 10;

  // Load users when modal opens or when applied filters/page changes
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, currentPage, appliedSearch, appliedRoleFilter]);

  const loadUsers = () => {
    dispatch(
      fetchAllUsers({
        page: currentPage,
        limit,
        search: appliedSearch,
        role: appliedRoleFilter,
      })
    );
  };

  const handleSearchClick = () => {
    // Apply the current input values as filters
    setAppliedSearch(searchInput);
    setAppliedRoleFilter(roleFilterInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setRoleFilterInput('');
    setAppliedSearch('');
    setAppliedRoleFilter('');
    setCurrentPage(1);
  };

  const handleRoleChange = async (userId, newRole) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      setSuccessMessage(`Rol actualizado exitosamente`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setErrorMessage(
        err.error?.message || err.message || 'Error al actualizar el rol'
      );
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleClose = () => {
    setSearchInput('');
    setRoleFilterInput('');
    setAppliedSearch('');
    setAppliedRoleFilter('');
    setCurrentPage(1);
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  const totalPages = Math.ceil(usersTotal / limit);

  if (!isOpen) return null;

  const modalContent = (
    <div className="manage-users-modal-overlay" onClick={handleClose}>
      <div className="manage-users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Gestionar Usuarios</h2>
          <button className="close-btn" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-content">
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
              />
            </div>
            <div className="role-filter">
              <select value={roleFilterInput} onChange={(e) => setRoleFilterInput(e.target.value)}>
                <option value="">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <div className="filter-buttons">
              <button className="search-btn" onClick={handleSearchClick}>
                Buscar
              </button>
              <button className="clear-btn" onClick={handleClearFilters}>
                Limpiar
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          {usersError && (
            <div className="error-message">
              {usersError.error?.message || usersError.message || 'Error al cargar usuarios'}
            </div>
          )}

          {usersLoading ? (
            <div className="loading">Cargando usuarios...</div>
          ) : (
            <>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol Actual</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="no-users">
                          No se encontraron usuarios
                        </td>
                      </tr>
                    ) : (
                      usersList.map((user) => (
                        <tr key={user.user_id}>
                          <td>{user.user_id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role === 'admin' ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td>
                            <div className="role-actions">
                              <button
                                className={`role-btn ${
                                  user.role === 'admin' ? 'active' : ''
                                }`}
                                onClick={() =>
                                  handleRoleChange(user.user_id, 'admin')
                                }
                                disabled={user.role === 'admin'}
                              >
                                Admin
                              </button>
                              <button
                                className={`role-btn ${
                                  user.role === 'customer' ? 'active' : ''
                                }`}
                                onClick={() =>
                                  handleRoleChange(user.user_id, 'customer')
                                }
                                disabled={user.role === 'customer'}
                              >
                                Customer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return ReactDOM.createPortal(modalContent, document.body);
};

export default ManageUsersModal;
