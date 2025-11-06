import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/userSelectors';
import { openCartModal } from '../../store/slices/cartSlice';
import logo from '../../../public/images/logo-nps.png';
import LoginIcon from '../../../public/iconos/LoginIcon';
import ProfileIcon from '../../../public/iconos/ProfileIcon';
import CartIcon from '../../../public/iconos/CartIcon';
import Cart from '../Cart/Cart';
import './Navbar.scss';

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="logo NPS" className="logo" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={location.pathname === '/products' ? 'active' : ''}
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === '/about' ? 'active' : ''}
            >
              Nosotros
            </Link>
          </li>
          <li className="icons-li">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className={`icon-link ${location.pathname === (isAuthenticated ? '/profile' : '/login') ? 'active' : ''}`}
            >
              {isAuthenticated ? <ProfileIcon /> : <LoginIcon />}
            </Link>
            <button
              className="icon-link"
              onClick={() => dispatch(openCartModal())}
            >
              <CartIcon />
            </button>
          </li>
        </ul>
      </nav>
      <Cart />
    </>
  );
};

export default Navbar;
