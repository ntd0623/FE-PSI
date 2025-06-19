import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// ❌ KHÔNG import redux-thunk nữa vì đã có sẵn trong defaultMiddleware

import { createLogger } from "redux-logger";
import {
    createStateSyncMiddleware,
    initMessageListener,
} from "redux-state-sync";

import rootReducer from "./store/reducers/rootReducer";

const reduxStateSyncConfig = {
    whitelist: ["APP_START_UP_COMPLETE"],
};

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "admin", "app"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [
    createStateSyncMiddleware(reduxStateSyncConfig),
];

if (import.meta.env.MODE === "development") {
    const logger = createLogger();
    middleware.push(logger);
}

const reduxStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(...middleware), // KHÔNG lặp lại thunk
    devTools: import.meta.env.MODE === "development",
});

initMessageListener(reduxStore);

export const persistor = persistStore(reduxStore);
export const dispatch = reduxStore.dispatch;

export default reduxStore;
