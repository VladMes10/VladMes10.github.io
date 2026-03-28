import React from 'react';

function HackathonCard({ title, theme, rules, deadline, image, isApplied, onToggle }) {
  return (
    <article className="card">
      <img src={image} alt={title} />
      <div className="card-content">
        <h3>{title}</h3>
        <p><strong>Тема:</strong> {theme}</p>
        <p><strong>Правила:</strong> {rules}</p>
        <p><strong>Дедлайн:</strong> {deadline}</p>
        
        {/* Умовний рендеринг кнопок на основі пропса isApplied */}
        {!isApplied ? (
          <button className="btn apply-btn" onClick={onToggle}>
            Подати заявку
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <button className="btn btn-applied" disabled>
              Заявку подано
            </button>
            <button className="btn-cancel" onClick={onToggle}>
              Скасувати
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default HackathonCard;