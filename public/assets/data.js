export const telegram = 'https://t.me/fle3n';

export const products = [
  { id: 'flat', category: 'coffee', name: 'Флэт уайт', note: 'Двойной эспрессо, бархатное молоко', price: 260, flavor: 'Крепкий и сливочный', customizable: true },
  { id: 'capp', category: 'coffee', name: 'Капучино', note: 'Мягкий вкус, воздушная пенка', price: 240, flavor: 'Сбалансированный, с ореховыми нотами', customizable: true },
  { id: 'raf', category: 'coffee', name: 'Ванильный раф', note: 'Сливочный, с настоящей ванилью', price: 310, flavor: 'Сладкий и нежный', customizable: true },
  { id: 'filter', category: 'coffee', name: 'Фильтр-кофе', note: 'Чистый вкус сезонного зерна', price: 190, flavor: 'Яркий и насыщенный', customizable: false },
  { id: 'crois', category: 'bakery', name: 'Круассан', note: 'Слоёный, сливочный, ещё тёплый', price: 190, customizable: false },
  { id: 'cookie', category: 'bakery', name: 'Кукис', note: 'Тёмный шоколад и морская соль', price: 160, customizable: false },
  { id: 'bun', category: 'bakery', name: 'Булочка с корицей', note: 'Ароматная корица и нежная глазурь', price: 220, customizable: false },
  { id: 'matcha', category: 'special', name: 'Матча-латте', note: 'Японский чай, нежное молоко', price: 320, flavor: 'Травянистый, мягкий; содержит кофеин', customizable: true },
  { id: 'cacao', category: 'special', name: 'Какао', note: 'Какао на молоке с насыщенным шоколадным вкусом', price: 250, flavor: 'Шоколадный и согревающий', customizable: true },
  { id: 'lemon', category: 'special', name: 'Лимонад', note: 'Лимон, мята и газированная вода', price: 270, flavor: 'Свежий и цитрусовый', customizable: false },
];

export const services = [
  { id: 'check', name: 'Диагностика и профилактика', price: 2500, duration: 30, description: 'Знакомство с врачом, осмотр и обсуждение дальнейших шагов.' },
  { id: 'treatment', name: 'Лечение зубов', price: 5900, duration: 45, description: 'Консультация по лечению. Врач объяснит варианты после осмотра.' },
  { id: 'ortho', name: 'Ортодонтия', price: 3000, duration: 40, description: 'Обсуждение прикуса, ожиданий и вариантов ортодонтической коррекции.' },
  { id: 'restore', name: 'Восстановление улыбки', price: 18000, duration: 45, description: 'Знакомство с вариантами восстановления формы и функции зубов.' },
];

export const projectTypes = {
  website: { name: 'Сайт для бизнеса', description: 'Структура, дизайн, адаптивная разработка и заявки.', steps: ['Структура и прототип', 'Дизайн и адаптивная вёрстка', 'Интеграции и проверка'] },
  bot: { name: 'Telegram-бот', description: 'Диалоги, запись, заявки и уведомления в мессенджере.', steps: ['Карта диалога', 'Логика и интеграции', 'Тестирование сценариев'] },
  ai: { name: 'Автоматизация и AI', description: 'Обработка запросов, документов и знаний команды.', steps: ['Разбор процесса и данных', 'Прототип на примерах', 'Оценка качества и запуск'] },
};

export const features = {
  assistant: 'Помощник для посетителей',
  catalog: 'Каталог товаров или услуг',
  booking: 'Онлайн-запись',
  crm: 'Интеграция с CRM',
  telegram: 'Уведомления в Telegram',
  knowledge: 'Поиск по базе знаний',
};

export function priceFor(product, size = '250', milk = 'regular') {
  return product.price + (product.customizable && size === '350' ? 50 : 0) + (product.customizable && milk === 'oat' ? 40 : 0);
}

export function recommendDrink({ kind = 'coffee', flavor = 'soft', milk = 'regular', budget = Infinity } = {}) {
  let id;
  if (kind === 'fresh') id = 'lemon';
  else if (kind === 'no-coffee') id = milk === 'none' ? 'lemon' : flavor === 'sweet' ? 'cacao' : 'matcha';
  else if (milk === 'none' || flavor === 'bright') id = 'filter';
  else id = flavor === 'sweet' ? 'raf' : flavor === 'strong' ? 'flat' : 'capp';
  let product = products.find(item => item.id === id);
  const price = item => priceFor(item, '250', milk);
  if (price(product) > budget) {
    const choices = products.filter(item => item.category !== 'bakery' && price(item) <= budget && (kind !== 'no-coffee' || item.category === 'special') && (kind !== 'fresh' || item.id === 'lemon') && (milk !== 'none' || !item.customizable));
    product = choices.sort((a, b) => price(a) - price(b))[0] || null;
  }
  return product ? { ...product, total: price(product), milk: product.customizable ? milk : 'none' } : null;
}

export function buildBrief({ type = 'website', business = '', goal = '', selected = [], timing = 'Обсудим' } = {}) {
  const project = Object.hasOwn(projectTypes, type) ? projectTypes[type] : projectTypes.website;
  const chosen = selected.filter(id => Object.hasOwn(features, id));
  return [
    'Привет! Хочу обсудить проект.',
    `Направление: ${project.name}`,
    business.trim() ? `Бизнес / проект: ${business.trim()}` : '',
    goal.trim() ? `Задача: ${goal.trim()}` : '',
    `Функции: ${chosen.length ? chosen.map(id => features[id]).join(', ') : 'определим вместе'}`,
    `Желаемый срок: ${timing}`,
    '',
    'Бюджет и окончательный объём согласуем после обсуждения.',
  ].filter(line => line !== '').join('\n');
}
