// Hypothetical USD quotes, deliberately fixed. Never presented as live market data.
export const instruments = Object.freeze([
	{ ticker: 'AAPL.US', name: 'Apple', priceCents: 17500, descr: 'Технологии и потребительская электроника' },
	{ ticker: 'MSFT.US', name: 'Microsoft', priceCents: 30500, descr: 'Программное обеспечение и облачные сервисы' },
	{ ticker: 'AMD.US', name: 'AMD', priceCents: 12500, descr: 'Процессоры и графические ускорители' },
	{ ticker: 'GOOGL.US', name: 'Alphabet', priceCents: 14000, descr: 'Поиск, интернет-сервисы и технологии' },
	{ ticker: 'TSLA.US', name: 'Tesla', priceCents: 25000, descr: 'Электромобили и энергетика' },
	{ ticker: 'AMZN.US', name: 'Amazon', priceCents: 15000, descr: 'Электронная коммерция и облачные сервисы' },
	{ ticker: 'NVDA.US', name: 'NVIDIA', priceCents: 45000, descr: 'Графические процессоры и вычисления' },
	{ ticker: 'SPY.US', name: 'SPDR S&P 500 ETF', priceCents: 43000, descr: 'Учебный пример биржевого фонда' },
].map(item => Object.freeze({ ...item, title: item.name, i_name: item.ticker === 'SPY.US' ? 'Фонд · USD' : 'Акция · USD', true_price: item.priceCents / 100 })))

export function findInstrument(ticker) {
	return instruments.find(item => item.ticker === ticker)
}

export function searchInstruments(query = '') {
	const term = query.trim().toLocaleLowerCase('ru')
	return instruments.filter(item => `${item.ticker} ${item.name} ${item.descr}`.toLocaleLowerCase('ru').includes(term))
}

export const demoRates = Object.freeze({ EUR: 100, USD: 90 })

// Original-looking news cards, with explicitly fictional, dated teaching material.
export const news = [
	{ id: 'portfolio', date: '2022-03-18', title: 'Учебная редакция: из чего складывается портфель', snippet: 'Деньги на счёте и стоимость активов показываются отдельно. Общая стоимость — их сумма.', body: 'В этой демонстрации котировки фиксированы. Покупка переводит часть денежных средств в активы, продажа — обратно. Комиссия 0,04% уменьшает общую стоимость при каждой сделке.' },
	{ id: 'quantity', date: '2022-03-17', title: 'Учебная редакция: частичная продажа', snippet: 'Чтобы продать часть позиции, выберите количество в портфеле. Остаток сохранится на счёте.', body: 'Количество должно быть целым положительным числом и не превышать остаток. При продаже всей позиции она исчезнет из портфеля. Каждая операция останется в истории.' },
	{ id: 'quotes', date: '2022-03-16', title: 'Учебная редакция: цена и комиссия', snippet: 'Стоимость заявки включает количество инструментов и комиссию. Перед подтверждением видна полная сумма.', body: 'Цены и валютные курсы придуманы для демонстрации интерфейса. Они не являются текущими или историческими биржевыми данными. Все сделки выполняются только внутри вашего браузера.' },
	{ id: 'local', date: '2022-03-15', title: 'Учебная редакция: ваш локальный кабинет', snippet: 'Профиль, баланс и история сохраняются в этом браузере. Регистрация не требуется.', body: 'Другой браузер или приватное окно получает собственный исходный портфель. Вкладки одного профиля браузера используют общий счёт. Сброс возвращает исходные данные, очистка хранилища браузера удаляет прогресс.' },
]
