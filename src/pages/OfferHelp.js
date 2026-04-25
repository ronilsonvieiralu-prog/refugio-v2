import React from 'react';
import HelpForm from '../components/HelpForm';
import useHelpItems from '../hooks/useHelpItems';
import './FormPage.css';

function OfferHelp() {
  const { addItem } = useHelpItems();

  return (
    <main className="form-page">
      <div className="form-page__container">
        <div className="form-page__header form-page__header--green">
          <span className="form-page__icon">🌟</span>
          <div>
            <h1 className="form-page__title">Oferecer Ajuda</h1>
            <p className="form-page__subtitle">
              Você pode fazer a diferença. Compartilhe o que tem a oferecer.
            </p>
          </div>
        </div>
        <div className="form-page__tips">
          <h3>💡 Dicas para uma boa oferta</h3>
          <ul>
            <li>Descreva claramente o que você pode oferecer</li>
            <li>Informe sua disponibilidade de horário</li>
            <li>Indique sua localização para facilitar o encontro</li>
            <li>Seja honesto sobre as condições e limitações</li>
          </ul>
        </div>
        <HelpForm type="oferta" onSubmit={addItem} />
      </div>
    </main>
  );
}

export default OfferHelp;
