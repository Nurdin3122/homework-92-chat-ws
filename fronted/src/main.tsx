import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import {Provider} from "react-redux";
import {persistor, store} from "./app/store.ts";
import {BrowserRouter} from "react-router-dom";
import {PersistGate} from "redux-persist/integration/react";

createRoot(document.getElementById('root')!).render(
   <Provider store={store}>
       <PersistGate persistor={persistor}>
       <BrowserRouter>
       <StrictMode>
           <App />
       </StrictMode>
       </BrowserRouter>
       </PersistGate>
   </Provider>

)
