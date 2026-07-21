const C = (name, amount, unit) => ({ name, amount, unit });

export const cocktails = [
  {
    id: 'margarita',
    name: 'Маргарита',
    ingredients: [C('Текила серебряная', 50, 'мл'), C('Сок лайм', 15, 'мл'), C('Ликер апельсин', 20, 'мл')],
    method: 'Шейк',
    serveware: 'коктейльная рюмка',
    garnish: ['краста из соли', 'долька лайма'],
  },
  {
    id: 'negroni',
    name: 'Негрони',
    ingredients: [C('Джин сухой', 30, 'мл'), C('Кампари', 30, 'мл'), C('Вермут красный', 30, 'мл')],
    method: 'Стир',
    serveware: 'рокс',
    garnish: ['твист из апельсиновой цедры'],
  },
  {
    id: 'manhattan',
    name: 'Манхеттен',
    ingredients: [C('Бурбон', 50, 'мл'), C('Вермут красный', 20, 'мл'), C('Биттер ангостура', 1, 'дэш')],
    method: 'Стир',
    serveware: 'рокс',
    garnish: ['коктейльная вишня'],
  },
  {
    id: 'aperol-spritz',
    name: 'Апероль Спритц',
    ingredients: [C('Апероль', 60, 'мл'), C('Сухое игристое', 90, 'мл'), C('Содовая', 1, 'топ')],
    method: 'Билд',
    serveware: 'винный бокал',
    garnish: ['долька апельсина'],
  },
  {
    id: 'white-russian',
    name: 'Белый русский',
    ingredients: [C('Водка', 40, 'мл'), C('Ликер кофе', 30, 'мл'), C('Сливки', 30, 'мл')],
    method: 'Билд',
    serveware: 'рокс',
    garnish: [],
  },
  {
    id: 'americano',
    name: 'Американо',
    ingredients: [C('Кампари', 30, 'мл'), C('Вермут красный', 30, 'мл'), C('Содовая', 1, 'топ')],
    method: 'Билд',
    serveware: 'рокс',
    garnish: ['твист апельсиновой цедры'],
  },
  {
    id: 'b52',
    name: 'Б52',
    ingredients: [C('Ликер кофейный', 15, 'мл'), C('Ликер сливочный', 15, 'мл'), C('Апельсиновый ликер', 15, 'мл')],
    method: 'Лееринг',
    serveware: 'шот',
    garnish: [],
  },
  {
    id: 'dry-martini',
    name: 'Драй мартини',
    ingredients: [C('Джин сухой', 60, 'мл'), C('Вермут сухой', 10, 'мл')],
    method: 'Стир',
    serveware: 'коктейльная рюмка',
    garnish: ['оливка на шпажке'],
  },
  {
    id: 'daiquiri',
    name: 'Дайкири',
    ingredients: [C('Ром светлый', 60, 'мл'), C('Сахарный сироп', 20, 'мл'), C('Сахар', 2, 'большие ложки')],
    method: 'Шейк',
    serveware: 'коктейльная рюмка',
    garnish: [],
  },
  {
    id: 'bellini',
    name: 'Беллини',
    ingredients: [C('Игристое сухое', 100, 'мл'), C('Пюре персик', 50, 'мл')],
    method: 'Билд',
    serveware: 'флюте',
    garnish: [],
  },
  {
    id: 'gin-tonic',
    name: 'Джин тоник',
    ingredients: [C('Джин сухой', 40, 'мл'), C('Тоник', 120, 'мл')],
    method: 'Билд',
    serveware: 'хайбол',
    garnish: ['долька лайма'],
  },
  {
    id: 'pina-colada',
    name: 'Пина колада',
    ingredients: [C('Ром светлый', 50, 'мл'), C('Пюре кокос', 30, 'мл'), C('Сок ананас', 50, 'мл')],
    method: 'Шейк',
    serveware: 'харрикейн',
    garnish: ['коктейльная вишня', 'долька ананаса'],
  },
  {
    id: 'clover-club',
    name: 'Кловер клаб',
    ingredients: [C('Джин сухой', 45, 'мл'), C('Сироп малина', 15, 'мл'), C('Сок лимон', 15, 'мл'), C('Яичный белок', 15, 'мл')],
    method: 'Шейк + Драй шейк',
    serveware: 'коктейльная рюмка',
    garnish: ['малина'],
  },
  {
    id: 'moscow-mule',
    name: 'Московский мул',
    ingredients: [C('Водка', 45, 'мл'), C('Сок лайм', 10, 'мл'), C('Пиво имбирное', 120, 'мл')],
    method: 'Билд',
    serveware: 'медная кружка',
    garnish: ['долька лайма'],
  },
  {
    id: 'cosmopolitan',
    name: 'Космополитен',
    ingredients: [C('Водка цитрус', 45, 'мл'), C('Ликер апельсин', 15, 'мл'), C('Сок лайм', 15, 'мл'), C('Сок клюква', 30, 'мл')],
    method: 'Шейк',
    serveware: 'коктейльная рюмка',
    garnish: ['твист лаймовой цедры'],
  },
];

export const fieldOrder = [
  {
    key: 'recipe',
    label: '1. Рецептура и объём',
    hint: 'Выберите или введите состав напитка',
  },
  {
    key: 'method',
    label: '2. Способ приготовления',
    hint: 'Например: Шейк, Стир или Билд',
  },
  {
    key: 'serveware',
    label: '3. Подача',
    hint: 'Выберите бокал или посуду подачи',
  },
  {
    key: 'garnish',
    label: '4. Украшение',
    hint: 'Можно указать несколько украшений через запятую',
  },
];

export function recipeSummary(cocktail) {
  return cocktail.ingredients
    .map((item) => `${item.name} - ${item.amount}${item.unit ? ` ${item.unit}` : ''}`)
    .join(', ');
}

export const fieldOptions = {
  recipe: cocktails.map((cocktail) => recipeSummary(cocktail)),
  method: [...new Set(cocktails.map((cocktail) => cocktail.method))],
  serveware: [...new Set(cocktails.map((cocktail) => cocktail.serveware))],
  garnish: [...new Set(cocktails.flatMap((cocktail) => (cocktail.garnish.length ? cocktail.garnish : ['нет'])))],
};
