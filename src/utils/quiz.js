import { recipeSummary } from '../data/cocktails';

const METHOD_HINTS = {
  'шейк + драй шейк': ['шейк', 'драй'],
  шейк: ['шейк'],
  стир: ['стир'],
  билд: ['билд'],
  лееринг: ['лееринг', 'layering'],
};

const SERVEWARE_HINTS = {
  'коктейльная рюмка': ['коктейльная рюмка', 'cocktail glass'],
  рокс: ['рокс', 'rocks'],
  шот: ['шот', 'shot'],
  хайбол: ['хайбол', 'highball'],
  флюте: ['флюте', 'flute'],
  харрикейн: ['харрикейн', 'hurricane'],
  'винный бокал': ['винный бокал', 'wine glass'],
  'медная кружка': ['медная кружка', 'mug'],
  'тики-бокал': ['тики-бокал', 'tiki'],
  зомби: ['зомби', 'zombie'],
};

export function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsAny(text, variants) {
  return variants.some((variant) => normalizeText(text).includes(normalizeText(variant)));
}

function scorePresence(text, expectedItems) {
  const normalized = normalizeText(text);
  const hits = expectedItems.filter((item) => normalized.includes(normalizeText(item))).length;
  return { hits, total: expectedItems.length };
}

function scoreRecipe(text, cocktail) {
  const expectedSummary = recipeSummary(cocktail);
  const normalizedText = normalizeText(text);
  const normalizedExpected = normalizeText(expectedSummary);
  if (!normalizedText) {
    return { verdict: 'wrong', expected: expectedSummary };
  }

  if (normalizedText === normalizedExpected) {
    return { verdict: 'correct', expected: expectedSummary };
  }

  const ingredientNames = cocktail.ingredients.map((item) => item.name);
  const ingredientAmounts = cocktail.ingredients.map((item) => `${item.amount} ${item.unit}`);
  const ingredientScore = scorePresence(text, ingredientNames);
  const amountScore = scorePresence(text, ingredientAmounts);
  const totalSignals = ingredientScore.hits + amountScore.hits;

  if (ingredientScore.hits === ingredientScore.total && amountScore.hits === amountScore.total) {
    return { verdict: 'correct', expected: expectedSummary };
  }

  if (totalSignals > 0) {
    return { verdict: 'partial', expected: expectedSummary };
  }

  return { verdict: 'wrong', expected: expectedSummary };
}

function scoreSingleValue(text, expected, hints = []) {
  const normalizedText = normalizeText(text);
  const normalizedExpected = normalizeText(expected);
  if (!normalizedText) {
    return { verdict: 'wrong', expected };
  }

  if (normalizedText === normalizedExpected || hints.some((hint) => normalizedText === normalizeText(hint))) {
    return { verdict: 'correct', expected };
  }

  if (normalizedText.includes(normalizedExpected) || containsAny(normalizedText, hints)) {
    return { verdict: 'partial', expected };
  }

  return { verdict: 'wrong', expected };
}

function scoreListValue(text, expectedItems) {
  const normalizedText = normalizeText(text);
  const normalizedExpected = expectedItems.map((item) => normalizeText(item));
  if (!normalizedText) {
    return { verdict: 'wrong', expected: expectedItems.join(', ') || 'нет' };
  }

  const exact = normalizedExpected.every((item) => normalizedText.includes(item));
  if (exact) {
    return { verdict: 'correct', expected: expectedItems.join(', ') || 'нет' };
  }

  const partialCount = normalizedExpected.filter((item) => normalizedText.includes(item)).length;
  if (partialCount > 0) {
    return { verdict: 'partial', expected: expectedItems.join(', ') || 'нет' };
  }

  if (normalizedExpected.length === 0 && /\b(нет|none|no|без)\b/.test(normalizedText)) {
    return { verdict: 'correct', expected: 'нет' };
  }

  return { verdict: 'wrong', expected: expectedItems.join(', ') || 'нет' };
}

export function assessAnswer(fieldKey, value, cocktail) {
  switch (fieldKey) {
    case 'recipe':
      return scoreRecipe(value, cocktail);
    case 'method':
      return scoreSingleValue(value, cocktail.method, METHOD_HINTS[normalizeText(cocktail.method)] ?? []);
    case 'serveware':
      return scoreSingleValue(value, cocktail.serveware, SERVEWARE_HINTS[normalizeText(cocktail.serveware)] ?? []);
    case 'garnish':
      return scoreListValue(value, cocktail.garnish);
    default:
      return { verdict: 'wrong', expected: '' };
  }
}

export function toStatusColor(verdict) {
  if (verdict === 'correct') return 'correct';
  if (verdict === 'partial') return 'partial';
  return 'wrong';
}

export function deckTitle(cocktail) {
  return cocktail?.name ?? 'Коктейль';
}
