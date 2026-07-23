import React, { useEffect, useMemo, useState } from 'react';
import AnswerStep from './components/AnswerStep';
import { cocktails, fieldOrder } from './data/cocktails';
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
  const [sessionFinished, setSessionFinished] = useState(false);

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

  const progressLabel = useMemo(
    () => `${sessionFinished ? cocktails.length : completedCards + 1}/${cocktails.length}`,
    [completedCards, sessionFinished],
  );

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
      setCompletedCards(cocktails.length);
      setSessionFinished(true);
      console.info('[cocktail-trainer] session finished', { totalCards: cocktails.length });
      return;
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
    setSessionFinished(false);
    console.info('[cocktail-trainer] session reset');
  }

  if (!currentCard) {
    return (
      <main className="app-shell">
        <div className="trainer-frame">Нет карточек для тренировки.</div>
      </main>
    );
  }

  if (sessionFinished) {
    return (
      <main className="app-shell">
        <section className="finish-card">
          <span className="finish-card__mark">✓</span>
          <p className="card-kicker">Тренировка завершена</p>
          <h1>Все карточки пройдены</h1>
          <p>Вы проверили рецептуры всех {cocktails.length} коктейлей. Новый круг начнётся только по вашему выбору.</p>
          <button className="primary-button" type="button" onClick={resetSession}>Пройти ещё раз <span>↻</span></button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="trainer-frame">
        <header className="trainer-topbar">
          <button className="round-button" type="button" aria-label="Назад">←</button>
          <div className="trainer-progress">
            <strong>{progressLabel}</strong>
            <span>Прогресс</span>
            <div className="progress-track"><i style={{ width: `${(completedCards + 1) / cocktails.length * 100}%` }} /></div>
          </div>
          <div className="trainer-meta">
            <button className="round-button" type="button" onClick={resetSession} aria-label="Сбросить тренировку">↻</button>
          </div>
        </header>

        <article className="cocktail-card">
          <div className="cocktail-card__shine" />
          <div className="cocktail-card__content">
            <div className="cocktail-copy">
              <p className="card-kicker">Классика · тренировка</p>
              <h1>{deckTitle(currentCard)}</h1>
              <p className="card-description">Восстановите рецепт по памяти. Каждый следующий шаг откроется после проверки.</p>
            </div>

            <div className="cocktail-visual">
              <img
                key={currentCard.id}
                src={`/cocktails/${currentCard.id}.webp`}
                alt={`Коктейль «${currentCard.name}»`}
              />
              <span className="cocktail-visual__glow" aria-hidden="true" />
            </div>

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
                    isFuture={index > stepIndex}
                  />
                );
              })}
            </div>

            {isComplete ? (
              <div className="card-actions">
                <p className="completion-copy">
                  {cardIndex === deck.length - 1 ? 'Последняя карточка пройдена.' : 'Карточка пройдена. Переходите к следующей.'}
                </p>
                <button className="primary-button" type="button" onClick={nextCard}>
                  {cardIndex === deck.length - 1 ? 'Завершить тест' : 'Следующая карточка'}
                </button>
              </div>
            ) : (
              <div className="card-actions card-actions--idle">
                <span>Шаг {stepIndex + 1} из {fieldOrder.length}</span>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
