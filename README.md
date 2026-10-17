# 💰 Честный брокер — интерактивное демо

Восстановленная работа 2022 года: **https://broker.ilyamedve.dev**.
Демопользователь **Алексей Демо**, без пароля и регистрации: 10 000$,
акции Apple, Microsoft и AMD. Покупка/частичная и полная продажа, поиск,
пересчёт портфеля, история, пополнение/списание по 300$, локальный профиль,
сохранение в браузере и сброс. Котировки условные, новости — учебные материалы.

Текущий запуск, проверки, исходная ревизия, публикация и восстановление:
[docs/restoration.md](docs/restoration.md). Firebase и внешние API не используются.

---

Ниже сохранено историческое описание оригинала **на март 2022 года**;
упоминания Firebase, регистрации и актуальных API относятся к старой версии.

# 💰 Честный Брокер

### 🎯 Цель

Дать пользователю общую информацию о компании + реализовать функционал личного кабинета (авторизация, торговля)

![code time](https://img.shields.io/badge/wakatime-84%20hrs%2025%20mins-blue)
![repo size](https://img.shields.io/github/repo-size/Terro216/RTUITLab_Recruit)
![total lines](https://img.shields.io/tokei/lines/github/Terro216/RTUITLab_Recruit)
![wheelmap](https://img.shields.io/wheelmap/a/26699541)
[![License: MIT](https://img.shields.io/badge/License-MIT-greener.svg)](https://opensource.org/licenses/MIT)

## Содержание

- #### [🗃️ Описание](#miniDescription)
- #### [👀 Внешний вид](#screenshots)
- #### [🧱 Стек](#stack)
- #### [🚀 Запуск](#launching)
- #### [📚 Постраничное описание](#fullDescription)
- #### [☎️ Контакты](#contacts)
- #### [⚖️ Остальное](#acknowledgments)

<a name="miniDescription"></a>

## 🗃️ Описание

На сайте есть страница контактов и страница тарифов, а в личном кабинете реализована регистрация/авторизация по номеру телефона и паролю (с проверкой ввода) и синхронизацией данных с firebase + записью в cookie. В самом личном кабинете можно покупать и продавать акции и другие финансовые инструменты, пополнять/списывать деньги со своего счета, (цены подгружаются динамически, информация о каждом изменении баланса и состава портфеля записывается в firestore, так что при заходе с разных устройств вы попадете в один и тот же личный кабинет), просмотра текущих новостей рынка(также загружаются по api) и редактированием своего профиля.

<a name="screenshots"></a>

## 👀 Внешний вид

<details>
<summary>Вид на пк</summary>

### Главная страница

![main](https://i.ibb.co/xL7yYY5/main.png)

---

### О нас

![about](https://i.ibb.co/2qrtw9h/about.png)

---

### Тарифы

![tariff](https://i.ibb.co/2ZJdTNr/tariff.png)

---

### Страница входа/регистрации

![login1](https://i.ibb.co/nmN2cm7/login-checkmobile.png)
![login2](https://i.ibb.co/FxS3Dd5/login-register.png)

---

### Личный кабинет - Главная

![portfolio-main](https://i.ibb.co/PMfBHHt/portfolio-main.png)

---

### Личный кабинет - Профиль

![portfolio-account](https://i.ibb.co/vDvTKrX/portfolio-account.png)

---

### Личный кабинет - Торговля

![portfolio-trade](https://i.ibb.co/1vn3y2Y/portfolio-trade.png)

---

### Личный кабинет - Новости

![portfolio-news](https://i.ibb.co/yFRzJGH/portfolio-news.png)

---

</details>

<details>
<summary>Вид на телефоне</summary>

### Главная страница

![mobile-main](https://i.ibb.co/pwX9T5w/mobile-main.png)

---

### Мобильный хедер

![mobile-header](https://i.ibb.co/Mk4rNXJ/mobile-header.png)

---

### О нас

![mobile-about](https://i.ibb.co/vxWDrcr/mobile-about.png)

---

### Тарифы

![mobile-tariff](https://i.ibb.co/SNFKGPQ/mobile-tariff.png)

---

### Страница входа/регистрации

![login1](https://i.ibb.co/k45YMf5/mobile-login-check-Mobile.png)
![login2](https://i.ibb.co/bF9Z9GR/mobile-login-register.png)

---

### Личный кабинет - Главная

![mobile-portfolio-main](https://i.ibb.co/0snHSc0/mobile-portfolio-main.png)

---

### Личный кабинет - Профиль

![mobile-portfolio-account](https://i.ibb.co/52GjyMV/mobile-portfolio-account.png)

---

### Личный кабинет - Торговля

![mobile-portfolio-trade](https://i.ibb.co/8stgmKy/mobile-portfolio-trade-1.png)

---

### Личный кабинет - Новости

![mobile-portfolio-news](https://i.ibb.co/tPjdC32/mobile-portfolio-news.png)

---

</details>

<a name="stack"></a>

## 🧱 Стек

- React
- SCSS
- Parcel
- Firebase
- API

<details>
<summary>А также</summary>
  
   * react-router
   * react-ticker
   * animate.css
   * eslint
   * prettier
   * babel
  
</details>

<a name="launching"></a>

## 🚀 Запуск

1. Скачать и установить [Node JS](https://nodejs.org/en/download/) и [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Клонировать репозиторий

```
git clone https://github.com/Terro216/RTUITLab_Recruit.git
cd RTUITLab_Recruit
```

3. Установить зависимости

```
npm i
```

4. Запустить сайт

```
npm run start
```

> Готово! Теперь остается открыть сайт в браузере ([http://localhost:1234](http://localhost:1234))

<a name="fullDescription"></a>

<h2>📚 Постраничное описание</h2>

<b>1. Главная страница</b> - рассказывается о компании, её принципах и преимуществах, демонстрируются отзывы (оформлены в виде бегущей строки) и предлагается открыть счёт:

---

- <b>О нас</b> - краткая история компании, контакты и адрес
- <b>Тарифы</b> - страница, показывающая тарифы обслуживания
- <b>Бизнесу</b> - находится в разработке IT-отделом компании
- <b>Обучение</b> - находится в разработке IT-отделом компании

---

<b>2. Личный кабинет</b> - попасть в него можно нажав на кнопку "Открыть счёт" в хедере или "Начать инвестировать" внизу экрана. Сначала открывается авторизация/регистрация пользователя, после которой происходит переход в сам личный кабинет:

---

- <b>Главная</b> - Отображает денежный баланс, стоимость приобретенных активов и выводит весь финансовый портфель. Так же присутствует возможность пополнить счет, вывести деньги, продать какие-либо финансовые инструменты
- <b>Профиль</b> - Показывает пользовательские данные, которые можно отредактировать. Так же здесь находится кнопка выхода из аккаунта
- <b>Новости</b> - Страница с новостями рынка, загружаемыми через api
- <b>Торговля</b> - На этой странице непосредственно можно покупать акции (и другие финансовые инструменты), искать их по тикеру и узнать текущий статус биржи и курс валют (все эти данные актуальные и загружаются через api)

---

<a name="contacts"></a>

## ☎️ Контакты

Мой [сайт-портфолио](https://ilyamed.site/)
<br/>
Все мои контакты в нём, а также на странице "О нас" этого сайта

<a name="acknowledgments"></a>

## ⚖️ Остальное

Вдохновение, благодарности, API...

- [Tradernet API](https://tradernet.ru/tradernet-api/)
- [News API](https://www.marketaux.com/)
- [Font Awesome Icons](https://fontawesome.com/)
- [Bages](https://shields.io/)
- [Loading.io](https://loading.io/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
