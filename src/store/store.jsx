import {configureStore, combineReducers} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";

const reducers = combineReducers({

});

const persistConfig = {
    key: 'root',
    storage, // 기본 설정 localStorage
}

const persistedReducers = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducers
})