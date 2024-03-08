import { configureStore } from "@reduxjs/toolkit";
import tourReducer from "../reducers/tourReducer";

export const store = configureStore({
  reducer: {
    tour: tourReducer,
  },
  devTools: true,
});
