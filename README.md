# RTK Contentful

[English version](README.en.md)

Односторінковий React-застосунок, присвячений XXXTENTACION. Контент концертів
завантажується з Contentful, музика відтворюється через SoundCloud Widget API,
а відео — з локальних медіафайлів та YouTube.

## Можливості

- головна сторінка з банерами та блоком відеоісторій з X;
- список минулих концертів із сетлістами;
- вбудовані YouTube-відео концертів і окремих треків;
- модальне вікно з навігацією між відео сетліста;
- оригінальний SoundCloud-віджет і власний синхронізований список треків;
- глобальний плаваючий аудіоплеєр;
- автоматична синхронізація аудіо та відео, щоб вони не грали одночасно;
- адаптивна верстка та анімації.

## Технології

- **React 18** — компоненти та інтерфейс;
- **Create React App / react-scripts 5** — локальний сервер і production-збірка;
- **React Router 6** — клієнтська маршрутизація;
- **Redux Toolkit + React Redux** — завантаження і зберігання даних Contentful;
- **Contentful GraphQL Content API** — концерти, сетлісти та CMS-треки;
- **SoundCloud Widget API** — треки, прогрес і керування відтворенням;
- **Framer Motion** — анімації;
- **Sass/SCSS** — стилі, змінні теми, міксини та адаптивність;
- **Testing Library** — інструменти для тестування React-компонентів.

Проєкт написаний на JavaScript із JSX, без TypeScript. Дані Contentful
отримуються через `fetch` і GraphQL-запити, а асинхронний стан обробляється
через `createAsyncThunk` та Redux slices.

У `package.json` також присутні `contentful`, `Swiper` і
`react-animate-on-scroll`, але поточний код у `src/` їх безпосередньо не
імпортує. Для Contentful зараз використовується звичайний `fetch`, а не SDK.

## Маршрути

- `/` — головна сторінка;
- `/tour` — минулі концерти та сетлісти;
- `/tracks` — SoundCloud-треки.

## Перший запуск

### 1. Передумови

Встановіть:

- [Node.js](https://nodejs.org/) 18 LTS або новішу версію;
- Yarn 1.x або npm;
- Git.

У репозиторії є lock-файли Yarn і npm. Оберіть один менеджер пакетів і не
змішуйте їх в одній установці. Нижче використовується Yarn.

### 2. Завантаження та встановлення

```bash
git clone <repository-url>
cd rtk-contentful
yarn install
```

Альтернатива через npm:

```bash
npm install
```

### 3. Налаштування змінних середовища

Створіть локальний файл конфігурації:

```bash
cp .env.example .env.local
```

Обов'язково заповніть:

- `REACT_APP_SPACE_ID` — ID простору Contentful;
- `REACT_APP_ACCESS_TOKEN` — read-only Content Delivery API token.

Не використовуйте Content Management API token. Змінні з префіксом
`REACT_APP_` потрапляють у клієнтську збірку та доступні у браузері.

Необов'язкові змінні вже мають стандартні значення в застосунку:

- `REACT_APP_FEATURED_X_POST_URL`;
- `REACT_APP_FEATURED_X_STORY_TWO_POST_URL`;
- `REACT_APP_XXXTENTACION_YOUTUBE_URL`;
- `REACT_APP_XXXTENTACION_SOUNDCLOUD_URL`;
- `REACT_APP_XXXTENTACION_TWITTER_URL`;
- `REACT_APP_XXXTENTACION_APPLE_MUSIC_URL`;
- `REACT_APP_XXXTENTACION_INSTAGRAM_URL`;
- `REACT_APP_XXXTENTACION_SPOTIFY_URL`.

Після зміни `.env.local` потрібно перезапустити локальний сервер.

### 4. Запуск

```bash
yarn start
```

Або:

```bash
npm start
```

Застосунок відкриється за адресою
[http://localhost:3000](http://localhost:3000).

## Налаштування Contentful

Застосунок звертається до GraphQL endpoint простору Contentful. Записи мають
бути опубліковані та доступні через Content Delivery API.

Очікувані content models та API field IDs:

### `TourItem`

- `date` — дата концерту;
- `place` — назва майданчика;
- `city` — місто;
- `country` — країна;
- `soldOut` — ознака sold out;
- `ticketLink` — посилання на квитки;
- `videoLink` — YouTube-посилання на відео концерту;
- `setlist` — список посилань на записи `Setlist Track`.

### `Setlist Track`

- `title` — назва треку;
- `note` — додаткова примітка;
- `videoLink` — YouTube-посилання.

### `Track`

- `date` — дата;
- `title` — назва;
- `link` — аудіофайл Contentful Asset;
- `cover` — обкладинка Contentful Asset.

Модель `Track` підтримується Redux-шаром, але основний музичний інтерфейс
зараз використовує каталог SoundCloud.

## Команди

```bash
yarn start       # локальний сервер розробки
yarn build       # оптимізована production-збірка в build/
yarn test        # тести в інтерактивному режимі
yarn eject       # незворотне вилучення конфігурації CRA
```

Production-збірка:

```bash
yarn build
```

Готові статичні файли з'являться в каталозі `build/`. Оскільки застосунок
використовує `BrowserRouter`, сервер хостингу повинен перенаправляти невідомі
маршрути, зокрема `/tour` і `/tracks`, на `index.html`.

## Структура проєкту

```text
src/
├── assets/       # зображення, іконки та відео
├── components/   # UI, плеєри, навігація та блоки сторінок
├── hooks/        # власні React hooks
├── pages/        # компоненти маршрутів
├── reducers/     # Redux slices та async thunks
├── store/        # конфігурація Redux store
├── styles/       # SCSS, тема, змінні та міксини
└── utils/        # GraphQL-запити, константи й допоміжні функції
```

Основні точки входу:

- `src/index.js` — React, Redux Provider і BrowserRouter;
- `src/components/App/AppRoutes.jsx` — маршрути;
- `src/store/index.js` — Redux store;
- `src/utils/queries.js` — GraphQL-запити Contentful;
- `src/styles/variables.scss` — кольори та дизайн-токени;
- `src/components/SoundCloudPlayerProvider.jsx` — глобальний стан аудіоплеєра.

## Зовнішні сервіси

Для повної роботи потрібне інтернет-з'єднання з:

- Contentful GraphQL API;
- SoundCloud та SoundCloud Widget API;
- YouTube для вбудованих концертних відео.

Відеоісторії з X зберігаються локально в `src/assets/videos`; посилання на
оригінальні публікації налаштовуються через змінні середовища.
