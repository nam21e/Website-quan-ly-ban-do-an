import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/assets/styles/sb-admin.css';

=======
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
>>>>>>> ad2b6d5 (Initialize project using Create React App)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
=======
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
>>>>>>> ad2b6d5 (Initialize project using Create React App)
