import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {StyledEngineProvider} from "@mui/material/styles";
import store from './store/store.jsx';
import { Provider } from 'react-redux';
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";

export let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <StyledEngineProvider injectFirst>
                <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                                <App />
                        </PersistGate>
                </Provider>
        </StyledEngineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
