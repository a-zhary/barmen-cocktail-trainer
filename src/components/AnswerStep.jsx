import React from 'react';

export default function AnswerStep({
  field,
  value,
  status,
  expected,
  onChange,
  onSubmit,
  isActive,
  isLocked,
  isFuture,
}) {
  if (isLocked) {
    return (
      <section className={`answer-step is-${status}`}>
        <div className="answer-step__header">
          <span className="answer-step__label">{field.label}</span>
          <span className="answer-step__badge">{status === 'correct' ? 'Верно' : status === 'partial' ? 'Частично' : 'Неверно'}</span>
        </div>
        <div className="answer-step__value">{value || 'Нет ответа'}</div>
        <div className="answer-step__expected">Правильный ответ: {expected || 'нет'}</div>
      </section>
    );
  }

  if (isFuture) {
    return (
      <section className="answer-step answer-step--future">
        <span className="answer-step__number">{field.label.split('.')[0]}</span>
        <span className="answer-step__label">{field.label.replace(/^\d+\.\s*/, '')}</span>
        <span className="answer-step__lock">⌁</span>
      </section>
    );
  }

  return (
    <form className="answer-step answer-step--active" onSubmit={onSubmit}>
      <label className="answer-step__header" htmlFor={field.key}>
        <span className="answer-step__label">{field.label}</span>
        <span className="answer-step__hint">{field.hint}</span>
      </label>
      <input
        id={field.key}
        name={field.key}
        className="answer-step__input"
        value={value}
        onChange={onChange}
        placeholder="Введите ответ"
        autoComplete="off"
        autoFocus={isActive}
      />
      <button className="answer-step__submit" type="submit" disabled={!value.trim()}>
        <span>Проверить</span><span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
