# RTK Contentful

[Українська версія](README.md)

A single-page React application dedicated to XXXTENTACION. Concert content is
loaded from Contentful, music is played through the SoundCloud Widget API, and
videos are served from local media files and YouTube.

## Features

- home page with banners and an X video stories block;
- past concert list with setlists;
- embedded YouTube videos for concerts and individual tracks;
- video modal with setlist navigation;
- original SoundCloud widget and a custom synchronized track list;
- global floating audio player;
- audio and video synchronization that prevents simultaneous playback;
- responsive layout and animations.

## Technologies

- **React 18** — components and user interface;
- **Create React App / react-scripts 5** — development server and production builds;
- **React Router 6** — client-side routing;
- **Redux Toolkit + React Redux** — Contentful data loading and state management;
- **Contentful GraphQL Content API** — concerts, setlists, and CMS tracks;
- **SoundCloud Widget API** — tracks, progress, and playback controls;
- **Framer Motion** — animations;
- **Sass/SCSS** — styling, theme variables, mixins, and responsive design;
- **Testing Library** — React component testing tools.

The project uses JavaScript with JSX and does not use TypeScript. Contentful
data is fetched with GraphQL requests, while asynchronous state is handled
through `createAsyncThunk` and Redux slices.

The `package.json` also contains `contentful`, `Swiper`, and
`react-animate-on-scroll`, but the current code in `src/` does not import them
directly. Contentful is currently accessed with the native `fetch` API rather
than the SDK.

## Routes

- `/` — home page;
- `/tour` — past concerts and setlists;
- `/tracks` — SoundCloud tracks.

## First-time setup

### 1. Prerequisites

Install:

- [Node.js](https://nodejs.org/) 18 LTS or newer;
- Yarn 1.x or npm;
- Git.

The repository contains both Yarn and npm lock files. Choose one package
manager and do not mix them within the same installation. The commands below
use Yarn.

### 2. Clone and install

```bash
git clone <repository-url>
cd rtk-contentful
yarn install
```

Alternatively, with npm:

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

The following variables are required:

- `REACT_APP_SPACE_ID` — Contentful space ID;
- `REACT_APP_ACCESS_TOKEN` — read-only Content Delivery API token.

Do not use a Content Management API token. Variables prefixed with
`REACT_APP_` are included in the client bundle and are visible in the browser.

The optional variables below already have default values in the application:

- `REACT_APP_FEATURED_X_POST_URL`;
- `REACT_APP_FEATURED_X_STORY_TWO_POST_URL`;
- `REACT_APP_XXXTENTACION_YOUTUBE_URL`;
- `REACT_APP_XXXTENTACION_SOUNDCLOUD_URL`;
- `REACT_APP_XXXTENTACION_TWITTER_URL`;
- `REACT_APP_XXXTENTACION_APPLE_MUSIC_URL`;
- `REACT_APP_XXXTENTACION_INSTAGRAM_URL`;
- `REACT_APP_XXXTENTACION_SPOTIFY_URL`.

Restart the development server after changing `.env.local`.

### 4. Start the application

```bash
yarn start
```

Or:

```bash
npm start
```

The application will be available at
[http://localhost:3000](http://localhost:3000).

## Contentful setup

The application sends GraphQL requests to the configured Contentful space.
Entries must be published and available through the Content Delivery API.

Expected content models and API field IDs:

### `TourItem`

- `date` — concert date;
- `place` — venue name;
- `city` — city;
- `country` — country;
- `soldOut` — sold-out status;
- `ticketLink` — ticket URL;
- `videoLink` — YouTube URL for the concert video;
- `setlist` — list of references to `Setlist Track` entries.

### `Setlist Track`

- `title` — track title;
- `note` — optional note;
- `videoLink` — YouTube URL.

### `Track`

- `date` — date;
- `title` — title;
- `link` — audio file stored as a Contentful Asset;
- `cover` — cover image stored as a Contentful Asset.

The Redux layer still supports the `Track` model, but the main music interface
currently uses the SoundCloud catalog.

## Commands

```bash
yarn start       # start the development server
yarn build       # create an optimized production build in build/
yarn test        # run tests in interactive mode
yarn eject       # irreversibly eject the CRA configuration
```

Create a production build:

```bash
yarn build
```

The generated static files are written to `build/`. Because the application
uses `BrowserRouter`, the hosting server must redirect unknown routes,
including `/tour` and `/tracks`, to `index.html`.

## Project structure

```text
src/
├── assets/       # images, icons, and videos
├── components/   # UI, players, navigation, and page sections
├── hooks/        # custom React hooks
├── pages/        # route components
├── reducers/     # Redux slices and async thunks
├── store/        # Redux store configuration
├── styles/       # SCSS, theme, variables, and mixins
└── utils/        # GraphQL queries, constants, and helper functions
```

Important entry points:

- `src/index.js` — React, Redux Provider, and BrowserRouter;
- `src/components/App/AppRoutes.jsx` — routes;
- `src/store/index.js` — Redux store;
- `src/utils/queries.js` — Contentful GraphQL queries;
- `src/styles/variables.scss` — colors and design tokens;
- `src/components/SoundCloudPlayerProvider.jsx` — global audio player state.

## External services

A complete experience requires internet access to:

- Contentful GraphQL API;
- SoundCloud and the SoundCloud Widget API;
- YouTube for embedded concert videos.

The X story videos are stored locally in `src/assets/videos`; links to the
original posts are configured through environment variables.
