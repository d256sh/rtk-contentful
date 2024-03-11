import { configureStore } from "@reduxjs/toolkit";
import tourReducer from "../reducers/tourReducer";
import tracksReducer from "../reducers/tracksReducer";

export const store = configureStore({
  reducer: {
    tour: tourReducer,
    tracks: tracksReducer,
  },
  devTools: true,
});
