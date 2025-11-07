import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/userSelectors';
import { openCartModal } from '../../store/slices/cartSlice';
import logo from '../../assets/images/logo-nps.png';
import LoginIcon from '../../assets/icons/LoginIcon';
import ProfileIcon from '../../assets/icons/ProfileIcon';
import CartIcon from '../../assets/icons/CartIcon';
import HamburgerMenuIcon from '../../assets/icons/HamburgerMenuIcon';
import Cart from '../Cart/Cart';
import './Navbar.scss';

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="logo NPS" className="logo" />
        </Link>
        <button
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <HamburgerMenuIcon />
        </button>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={location.pathname === '/products' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === '/about' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
          </li>
          <li className="icons-li">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className={`icon-link ${location.pathname === (isAuthenticated ? '/profile' : '/login') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {isAuthenticated ? <ProfileIcon /> : <LoginIcon />}
            </Link>
            <button
              className="icon-link"
              onClick={() => {
                dispatch(openCartModal());
                setIsMenuOpen(false);
              }}
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
