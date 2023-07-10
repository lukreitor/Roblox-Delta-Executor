import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { OrderContextProvider } from './context/OrderContext';
import { RoleContextProvider } from './context/RoleContext';
import { RoutesContextProvider } from './context/RoutesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RoutesContextProvider>
      <RoleContextProvider>
        <OrderContextProvider>
            <App />
        </OrderContextProvider>
      </RoleContextProvider>
    </RoutesContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
