import { combineReducers } from "redux";

import appReducer from "./appReducer";
import adminReducer from "./adminReducer";
import userReducer from "./userReducer";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistCommonConfig = {
  storage,
  stateReconciler: autoMergeLevel2,
};

// Không bị trùng key
const adminPersistConfig = {
  ...persistCommonConfig,
  key: "admin",
  whitelist: ["isLoggedIn", "adminInfo"],
};

const userPersistConfig = {
  ...persistCommonConfig,
  key: "user",
  whitelist: ["isLoggedIn", "userInfo"],
};

const appPersistConfig = {
  ...persistCommonConfig,
  key: "app",
  whitelist: ["language"],
};

// Không cần truyền history
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  admin: persistReducer(adminPersistConfig, adminReducer),
  app: persistReducer(appPersistConfig, appReducer),
});

export default rootReducer;
