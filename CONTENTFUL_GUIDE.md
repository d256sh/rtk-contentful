# Інструкція: Як додати нову модель (Content Type) в Contentful

Оскільки Contentful є "headless CMS", усі дані та їхня структура створюються в адмін-панелі (через веб-інтерфейс), а потім React-додаток просто "витягує" ці дані через GraphQL API.

Якщо ви хочете створити нову модель (наприклад, для збереження кастомних плейлистів або нових треків), виконайте наступні кроки.

## Крок 1: Створення Content Model (Структури)

1. Зайдіть у свій акаунт [Contentful](https://app.contentful.com/).
2. У верхньому навігаційному меню натисніть на вкладку **Content model**.
3. Натисніть синю кнопку **Add content type** у правому верхньому куті.
4. У вікні, що з'явиться, введіть:
   - **Name**: Наприклад, `Playlist` (назва вашої моделі).
   - **Api Identifier**: Згенерується автоматично (наприклад, `playlist`).
   - **Description**: (Необов'язково) опис того, для чого ця модель.
5. Натисніть **Create**.

## Крок 2: Додавання полів (Fields) до моделі

Після створення моделі вам потрібно додати до неї поля. Натисніть кнопку **Add field** і виберіть тип поля.

Наприклад, для моделі `Playlist` ви можете додати:
1. **Текстове поле для назви:**
   - Виберіть тип **Text** → **Short text**.
   - Назвіть поле `Title`.
   - Натисніть *Create*.
2. **Поле для списку треків (Масив ідентифікаторів):**
   - Виберіть тип **JSON object** (щоб зберігати масив ID треків, наприклад `[0, 5, 12]`) АБО виберіть тип **Reference** (Many references), якщо ви хочете посилатися на існуючу в Contentful модель `Track`.
   - Назвіть поле `Tracks`.
   - Натисніть *Create*.

Після того, як ви додали всі необхідні поля, обов'язково натисніть зелену кнопку **Save** у правому верхньому куті, щоб зберегти саму модель.

## Крок 3: Створення контенту (Content)

Тепер, коли структура (модель) готова, ви можете додавати реальні дані.

1. Перейдіть на вкладку **Content** у верхньому меню.
2. Натисніть синю кнопку **Add entry** і виберіть вашу нову модель (наприклад, `Playlist`).
3. Заповніть поля:
   - **Title**: "Мій улюблений плейлист"
   - **Tracks**: Вставте дані (або виберіть референси).
4. Коли закінчите, натисніть зелену кнопку **Publish** справа. Якщо ви не натиснете Publish, дані матимуть статус *Draft* і не будуть доступні в React-додатку.

---

## Крок 4: Як отримати ці дані в React (через GraphQL)

Після публікації даних у Contentful, вони стають доступними через GraphQL API. Щоб витягнути їх у коді:

### 1. Додайте новий GraphQL запит
Відкрийте файл `src/utils/queries.js` і створіть новий запит. Зверніть увагу: Contentful автоматично додає суфікс `Collection` до ідентифікатора вашої моделі (наприклад, `playlist` стає `playlistCollection`).

```javascript
// src/utils/queries.js
export const playlistCollectionQuery = `
  {
    playlistCollection {
      items {
        sys {
          id
        }
        title
        tracks
      }
    }
  }
`;
```

### 2. Створіть Redux Thunk для завантаження
У папці `src/reducers/` створіть або оновіть редюсер (наприклад `playlistReducer.js`), щоб зробити запит:

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../utils/common";
import { playlistCollectionQuery } from "../utils/queries";

export const getPlaylists = createAsyncThunk(
  "playlists/getPlaylists",
  async (_, thunkAPI) => {
    try {
      const data = await request(playlistCollectionQuery);
      return data.playlistCollection.items;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// ... стандартний код слайсу (як у tourReducer.js)
```

### 3. Використайте в компоненті
```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylists } from "../reducers/playlistReducer";

const MyPlaylists = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.playlists);

  useEffect(() => {
    dispatch(getPlaylists());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {items.map(playlist => (
        <h3 key={playlist.sys.id}>{playlist.title}</h3>
      ))}
    </div>
  );
};
```

> **Порада:** Ви можете тестувати свої GraphQL запити в браузері. Встановіть програму типу [Altair GraphQL Client](https://altairgraphql.dev/) або [Apollo Studio](https://studio.apollographql.com/), введіть ваш URL (`https://graphql.contentful.com/content/v1/spaces/ВАШ_SPACE_ID`) і передайте `Authorization: Bearer ВАШ_ACCESS_TOKEN` у заголовках (Headers). Це дозволить вам перевірити, чи правильно ви написали запит, перш ніж писати код.
