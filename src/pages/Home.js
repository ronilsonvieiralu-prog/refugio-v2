import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '🙏',
    title: 'Pedir Ajuda',
    description: 'Precisa de apoio? Compartilhe sua necessidade com a comunidade.',
    link: '/pedir-ajuda',
    cta: 'Fazer pedido',
    color: 'orange',
  },
  {
    icon: '🌟',
    title: 'Oferecer Ajuda',
    description: 'Tem algo a oferecer? Disponibilize seu tempo, recursos ou habilidades.',
    link: '/oferecer-ajuda',
    cta: 'Oferecer agora',
    color: 'green',
  },
  {
    icon: '📋',
    title: 'Ver Listagens',
    description: 'Explore pedidos e ofertas de ajuda na sua comunidade.',
    link: '/listagens',
    cta: 'Ver listagens',
    color: 'blue',
  },
];

const categories = [
  { icon: '🍽️', label: 'Alimentação' },
  { icon: '🏠', label: 'Moradia' },
  { icon: '🚗', label: 'Transporte' },
  { icon: '🏥', label: 'Saúde' },
  { icon: '👕', label: 'Roupas' },
  { icon: '💙', label: 'Apoio Emocional' },
  { icon: '📚', label: 'Educação' },
  { icon: '💼', label: 'Trabalho' },
];

function Home() {
  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🏠 Plataforma de Ajuda Mútua</div>
          <h1 className="hero-title">
            Refúgio<br />
            <span className="hero-highlight">Juntos somos mais fortes</span>
          </h1>
          <p className="hero-description">
            Uma plataforma comunitária onde pessoas podem pedir e oferecer ajuda umas às outras.
            Alimentação, moradia, transporte, saúde — aqui ninguém fica sozinho.
          </p>
          <div className="hero-actions">
            <Link to="/pedir-ajuda" className="btn btn--primary">
              🙏 Preciso de Ajuda
            </Link>
            <Link to="/oferecer-ajuda" className="btn btn--secondary">
              🌟 Quero Ajudar
            </Link>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="hero-emoji-grid">
            {['🤝', '💙', '🏠', '🍽️', '👐', '❤️', '🌱', '✨'].map((e, i) => (
              <span key={i} className="hero-emoji" style={{ animationDelay: `${i * 0.15}s` }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="features">
        <h2 className="section-title">Como funciona?</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.link} className={`feature-card feature-card--${f.color}`}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
              <Link to={f.link} className={`feature-btn feature-btn--${f.color}`}>
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h2 className="section-title">Categorias de Ajuda</h2>
        <div className="categories-grid">
          {categories.map((c) => (
            <Link key={c.label} to="/listagens" className="category-chip">
              <span className="category-icon">{c.icon}</span>
              <span className="category-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Faça parte da nossa comunidade</h2>
          <p>Cada gesto de ajuda transforma vidas. Comece agora mesmo.</p>
          <div className="cta-actions">
            <Link to="/listagens" className="btn btn--white">
              📋 Ver Listagens
            </Link>
            <Link to="/pedir-ajuda" className="btn btn--outline">
              🙏 Pedir Ajuda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
