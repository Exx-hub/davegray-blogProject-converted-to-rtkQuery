import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    // posts: postsReducer,
    // users: usersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// reducerpath in api slice -- in this project we named it "api"

//* MIDDLEWARE HERE -
// Warning: Middleware for RTK-Query API at reducerPath "api" has not been added to the store.
// Features like automatic cache collection, automatic refetching etc. will not be available
