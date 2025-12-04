import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const positions = {};

export default function ScrollRestoration() {
  const { key, pathname } = useLocation();

  useEffect(() => {
    if (positions[key]) {
      window.scrollTo({
        top: positions[key],
        behavior: 'instant',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    }

    const handleScroll = () => {
      positions[key] = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [key, pathname]);

  return null;
}
