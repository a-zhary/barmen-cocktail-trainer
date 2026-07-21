import React, { useEffect, useMemo, useState } from 'react';
import AnswerStep from './components/AnswerStep';
import { cocktails, fieldOrder, fieldOptions } from './data/cocktails';
import { assessAnswer, deckTitle, normalizeText } from './utils/quiz';

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck(source, previousId = null) {
  const deck = shuffle(source);
  if (previousId && deck.length > 1 && deck[0].id === previousId) {
    [deck[0], deck[1]] = [deck[1], deck[0]];
  }
  return deck;
}

const emptyStepState = () =>
  fieldOrder.reduce((acc, field) => {
    acc[field.key] = { value: '', verdict: null, expected: '' };
    return acc;
  }, {});

export default function App() {
  const [deck, setDeck] = useState(() => createDeck(cocktails));
  const [cardIndex, setCardIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState(() => emptyStepState());
  const [completedCards, setCompletedCards] = useState(0);

  const currentCard = deck[cardIndex];
  const isComplete = stepIndex >= fieldOrder.length;

  useEffect(() => {
    console.info('[cocktail-trainer] session started', { totalCards: cocktails.length });
  }, []);

  useEffect(() => {
    if (!currentCard) return;
    console.info('[cocktail-trainer] card loaded', {
      cardId: currentCard.id,
      cardName: currentCard.name,
      deckPosition: cardIndex + 1,
      deckSize: deck.length,
    });
  }, [currentCard, cardIndex, deck.length]);

  const activeField = fieldOrder[stepIndex] ?? null;

  const progressLabel = useMemo(() => `${completedCards + 1}/${cocktails.length}`, [completedCards]);

  function submitAnswer(event) {
    event.preventDefault();
    if (!currentCard || !activeField) return;

    const formData = new FormData(event.currentTarget);
    const inputValue = String(formData.get(activeField.key) ?? '').trim();
    const evaluation = assessAnswer(activeField.key, inputValue, currentCard);

    console.debug('[cocktail-trainer] evaluated answer', {
      cardId: currentCard.id,
      field: activeField.key,
      inputValue,
      normalizedInput: normalizeText(inputValue),
      expected: evaluation.expected,
      verdict: evaluation.verdict,
    });

    setResults((previous) => ({
      ...previous,
      [activeField.key]: {
        value: inputValue,
        verdict: evaluation.verdict,
        expected: evaluation.expected,
      },
    }));

    setStepIndex((previous) => previous + 1);
  }

  function nextCard() {
    const nextIndex = cardIndex + 1;
    const reachedEnd = nextIndex >= deck.length;

    if (reachedEnd) {
      setDeck((previousDeck) => createDeck(previousDeck, currentCard?.id));
      setCardIndex(0);
    } else {
      setCardIndex(nextIndex);
    }

    setStepIndex(0);
    setResults(emptyStepState());
    setCompletedCards((value) => value + 1);
    console.info('[cocktail-trainer] advanced card', { currentCard: currentCard?.id, reachedEnd });
  }

  function resetSession() {
    setDeck(createDeck(cocktails, currentCard?.id));
    setCardIndex(0);
    setStepIndex(0);
    setResults(emptyStepState());
    setCompletedCards(0);
    console.info('[cocktail-trainer] session reset');
  }

  if (!currentCard) {
    return (
      <main className="app-shell">
        <div className="trainer-frame">Нет карточек для тренировки.</div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="trainer-frame">
        <header className="trainer-topbar">
          <div>
            <p className="eyebrow">Cocktail recipe trainer</p>
            <h1>Карточки рецептур коктейлей</h1>
          </div>
          <div className="trainer-meta">
            <span className="meta-pill">Карточка {progressLabel}</span>
            <button className="ghost-button" type="button" onClick={resetSession}>
              Сбросить
            </button>
          </div>
        </header>

        <article className="cocktail-card">
          <div className="cocktail-card__shine" />
          <div className="cocktail-card__content">
            <p className="card-kicker">Случайная карточка</p>
            <h2>{deckTitle(currentCard)}</h2>
            <p className="card-description">Введите ответы по очереди. Каждый следующий блок открывается после проверки предыдущего.</p>

            <div className="steps-stack">
              {fieldOrder.map((field, index) => {
                const state = results[field.key];
                const isLocked = index < stepIndex;
                const isActive = index === stepIndex;
                return (
                  <AnswerStep
                    key={`${currentCard.id}-${field.key}`}
                    field={field}
                    value={state.value}
                    status={state.verdict}
                    expected={state.expected}
                    options={fieldOptions[field.key]}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setResults((previous) => ({
                        ...previous,
                        [field.key]: { ...previous[field.key], value: nextValue },
                      }));
                    }}
                    onSubmit={submitAnswer}
                    isActive={isActive}
                    isLocked={isLocked}
                  />
                );
              })}
            </div>

            {isComplete ? (
              <div className="card-actions">
                <p className="completion-copy">Карточка пройдена. Переходите к следующей.</p>
                <button className="primary-button" type="button" onClick={nextCard}>
                  Следующая карточка
                </button>
              </div>
            ) : (
              <div className="card-actions card-actions--idle">
                <span>Осталось шагов: {fieldOrder.length - stepIndex}</span>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
