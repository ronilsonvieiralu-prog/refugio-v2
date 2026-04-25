import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpCard from '../components/HelpCard';
import useHelpItems from '../hooks/useHelpItems';
import './Listings.css';

const CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'alimentacao', label: '🍽️ Alimentação' },
  { value: 'moradia', label: '🏠 Moradia' },
  { value: 'transporte', label: '🚗 Transporte' },
  { value: 'saude', label: '🏥 Saúde' },
  { value: 'roupas', label: '👕 Roupas' },
  { value: 'apoio_emocional', label: '💙 Apoio Emocional' },
  { value: 'educacao', label: '📚 Educação' },
  { value: 'trabalho', label: '💼 Trabalho' },
  { value: 'outro', label: '🤝 Outro' },
];

function Listings() {
  const { items, deleteItem } = useHelpItems();
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = items.filter((item) => {
    if (filterType && item.type !== filterType) return false;
    if (filterCategory && item.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pedidos = filtered.filter((i) => i.type === 'pedido').length;
  const ofertas = filtered.filter((i) => i.type === 'oferta').length;

  return (
    <main className="listings">
      <div className="listings__header">
        <h1 className="listings__title">📋 Listagens</h1>
        <p className="listings__subtitle">
          Veja todos os pedidos e ofertas de ajuda da comunidade
        </p>
      </div>

      {/* Filters */}
      <div className="listings__filters">
        <input
          type="search"
          className="filter-search"
          placeholder="🔍 Buscar por título, nome ou localização..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">Tipo:</span>
            <div className="filter-btns">
              {[
                { value: '', label: 'Todos' },
                { value: 'pedido', label: '🙏 Pedidos' },
                { value: 'oferta', label: '🌟 Ofertas' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`filter-btn ${filterType === opt.value ? 'filter-btn--active' : ''}`}
                  onClick={() => setFilterType(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Categoria:</span>
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {filtered.length > 0 && (
        <div className="listings__stats">
          <span className="stat stat--total">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
          {pedidos > 0 && <span className="stat stat--pedido">🙏 {pedidos} pedido{pedidos !== 1 ? 's' : ''}</span>}
          {ofertas > 0 && <span className="stat stat--oferta">🌟 {ofertas} oferta{ofertas !== 1 ? 's' : ''}</span>}
        </div>
      )}

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="listings__empty">
          {items.length === 0 ? (
            <>
              <span className="empty-icon">🌱</span>
              <h2>Nenhuma publicação ainda</h2>
              <p>Seja o primeiro a publicar um pedido ou oferta de ajuda!</p>
              <div className="empty-actions">
                <Link to="/pedir-ajuda" className="empty-btn empty-btn--orange">
                  🙏 Pedir Ajuda
                </Link>
                <Link to="/oferecer-ajuda" className="empty-btn empty-btn--green">
                  🌟 Oferecer Ajuda
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="empty-icon">🔍</span>
              <h2>Nenhum resultado encontrado</h2>
              <p>Tente ajustar os filtros ou a busca.</p>
              <button
                className="empty-btn empty-btn--gray"
                onClick={() => {
                  setFilterType('');
                  setFilterCategory('');
                  setSearchQuery('');
                }}
              >
                Limpar filtros
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="listings__grid">
          {filtered.map((item) => (
            <HelpCard key={item.id} item={item} onDelete={deleteItem} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Listings;
