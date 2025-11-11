import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ContactButton.scss';
import ContactIcon from '../../assets/icons/ContactIcon';

function ContactButton() {
  const phoneNumber = '573229713519';
  const message = 'Hola, estoy interesado en sus productos.';
  const location = useLocation();
  const [buttonStyle, setButtonStyle] = useState({
    opacity: 0,
    transform: 'translateY(100%)',
  });

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (location.pathname === '/') {
        if (scrollY >= windowHeight) {
          setButtonStyle({ opacity: 1, transform: 'translateY(0)' });
        } else {
          setButtonStyle({ opacity: 0, transform: 'translateY(100%)' });
        }
      } else {
        setButtonStyle({ opacity: 1, transform: 'translateY(0)' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <>
      <button
        onClick={handleClick}
        className="contact-button"
        style={buttonStyle}
      >
        <ContactIcon className="contact-icon" />
        CONTACTANOS
      </button>
    </>
  );
}

export default ContactButton;
