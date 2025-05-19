import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';  // Keep your existing CSS import path
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';  // Add this line for the new global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();