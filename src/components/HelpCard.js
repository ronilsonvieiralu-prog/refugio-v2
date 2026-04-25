import React from 'react';
import './HelpCard.css';

const CATEGORY_ICONS = {
  alimentacao: '🍽️',
  moradia: '🏠',
  transporte: '🚗',
  saude: '🏥',
  roupas: '👕',
  apoio_emocional: '💙',
  educacao: '📚',
  trabalho: '💼',
  outro: '🤝',
};

const CATEGORY_LABELS = {
  alimentacao: 'Alimentação',
  moradia: 'Moradia',
  transporte: 'Transporte',
  saude: 'Saúde',
  roupas: 'Roupas',
  apoio_emocional: 'Apoio Emocional',
  educacao: 'Educação',
  trabalho: 'Trabalho',
  outro: 'Outro',
};

function HelpCard({ item, onDelete }) {
  const icon = CATEGORY_ICONS[item.category] || '🤝';
  const categoryLabel = CATEGORY_LABELS[item.category] || item.category;
  const date = new Date(item.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className={`help-card help-card--${item.type}`}>
      <div className="help-card__header">
        <span className="help-card__icon">{icon}</span>
        <div className="help-card__meta">
          <span className={`help-card__badge help-card__badge--${item.type}`}>
            {item.type === 'pedido' ? '🙏 Pedido' : '🌟 Oferta'}
          </span>
          <span className="help-card__category">{categoryLabel}</span>
        </div>
        {onDelete && (
          <button
            className="help-card__delete"
            onClick={() => onDelete(item.id)}
            title="Remover"
          >
            ✕
          </button>
        )}
      </div>

      <h3 className="help-card__title">{item.title}</h3>
      <p className="help-card__description">{item.description}</p>

      <div className="help-card__footer">
        <span className="help-card__author">👤 {item.name}</span>
        {item.contact && (
          <span className="help-card__contact">📞 {item.contact}</span>
        )}
        {item.location && (
          <span className="help-card__location">📍 {item.location}</span>
        )}
        <span className="help-card__date">📅 {date}</span>
      </div>
    </div>
  );
}

export default HelpCard;
