import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/listagens', label: 'Listagens' },
    { to: '/pedir-ajuda', label: 'Pedir Ajuda' },
    { to: '/oferecer-ajuda', label: 'Oferecer Ajuda' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-brand">
          <span className="header-icon">🏠</span>
          <span className="header-title">Refúgio</span>
          <span className="header-subtitle">Ajuda Mútua</span>
        </Link>
        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
