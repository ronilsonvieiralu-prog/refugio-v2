import React from 'react';
import HelpForm from '../components/HelpForm';
import useHelpItems from '../hooks/useHelpItems';
import './FormPage.css';

function RequestHelp() {
  const { addItem } = useHelpItems();

  return (
    <main className="form-page">
      <div className="form-page__container">
        <div className="form-page__header form-page__header--orange">
          <span className="form-page__icon">🙏</span>
          <div>
            <h1 className="form-page__title">Pedir Ajuda</h1>
            <p className="form-page__subtitle">
              Compartilhe sua necessidade. A comunidade está aqui por você.
            </p>
          </div>
        </div>
        <div className="form-page__tips">
          <h3>💡 Dicas para um bom pedido</h3>
          <ul>
            <li>Seja específico sobre o que você precisa</li>
            <li>Informe a urgência e prazo, se houver</li>
            <li>Forneça uma forma de contato para facilitar a ajuda</li>
            <li>Sua localização ajuda a encontrar voluntários próximos</li>
          </ul>
        </div>
        <HelpForm type="pedido" onSubmit={addItem} />
      </div>
    </main>
  );
}

export default RequestHelp;
