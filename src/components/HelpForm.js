import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpForm.css';

const CATEGORIES = [
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

function HelpForm({ type, onSubmit }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    name: '',
    contact: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!form.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!form.category) newErrors.category = 'Categoria é obrigatória';
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ ...form, type });
    setSubmitted(true);
  };

  const isPedido = type === 'pedido';
  const colorClass = isPedido ? 'form--orange' : 'form--green';

  if (submitted) {
    return (
      <div className={`form-success ${colorClass}`}>
        <span className="form-success__icon">{isPedido ? '🙏' : '🌟'}</span>
        <h2>{isPedido ? 'Pedido enviado com sucesso!' : 'Oferta publicada com sucesso!'}</h2>
        <p>
          {isPedido
            ? 'Seu pedido foi publicado. A comunidade estará de olho e alguém irá te ajudar em breve!'
            : 'Sua oferta foi publicada. Alguém que precisa vai entrar em contato com você!'}
        </p>
        <div className="form-success__actions">
          <button
            className={`form-btn ${colorClass}`}
            onClick={() => navigate('/listagens')}
          >
            📋 Ver Listagens
          </button>
          <button
            className="form-btn form-btn--secondary"
            onClick={() => {
              setForm({ title: '', description: '', category: '', name: '', contact: '', location: '' });
              setSubmitted(false);
            }}
          >
            {isPedido ? '+ Novo Pedido' : '+ Nova Oferta'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className={`help-form ${colorClass}`} onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Título *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          placeholder={isPedido ? 'Ex: Preciso de alimentos básicos' : 'Ex: Ofereço carona para o centro'}
          value={form.title}
          onChange={handleChange}
          maxLength={100}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="category">
          Categoria *
        </label>
        <select
          id="category"
          name="category"
          className={`form-select ${errors.category ? 'form-input--error' : ''}`}
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Selecione uma categoria</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {errors.category && <span className="form-error">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Descrição *
        </label>
        <textarea
          id="description"
          name="description"
          className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
          placeholder={
            isPedido
              ? 'Descreva o que você precisa, quantidades, urgência, etc.'
              : 'Descreva o que você pode oferecer, disponibilidade, condições, etc.'
          }
          value={form.description}
          onChange={handleChange}
          rows={4}
          maxLength={500}
        />
        <div className="form-char-count">{form.description.length}/500</div>
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Seu nome *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            placeholder="Como você quer ser chamado"
            value={form.name}
            onChange={handleChange}
            maxLength={80}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact">
            Contato <span className="form-optional">(opcional)</span>
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            className="form-input"
            placeholder="Telefone, WhatsApp, e-mail..."
            value={form.contact}
            onChange={handleChange}
            maxLength={100}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="location">
          Localização <span className="form-optional">(opcional)</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          className="form-input"
          placeholder="Bairro, cidade ou referência"
          value={form.location}
          onChange={handleChange}
          maxLength={120}
        />
      </div>

      <button type="submit" className={`form-submit ${colorClass}`}>
        {isPedido ? '🙏 Publicar Pedido' : '🌟 Publicar Oferta'}
      </button>
    </form>
  );
}

export default HelpForm;
