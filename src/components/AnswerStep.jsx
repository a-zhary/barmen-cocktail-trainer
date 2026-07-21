import React from 'react';

export default function AnswerStep({
  field,
  value,
  status,
  expected,
  options,
  onChange,
  onSubmit,
  isActive,
  isLocked,
}) {
  const listId = `${field.key}-options`;

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
        list={listId}
        value={value}
        onChange={onChange}
        placeholder="Начните ввод или выберите из списка"
        autoComplete="off"
        autoFocus={isActive}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <button className="answer-step__submit" type="submit" disabled={!value.trim()}>
        Проверить
      </button>
    </form>
  );
}
