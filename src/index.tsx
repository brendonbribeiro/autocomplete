import React from 'react';
import ReactDOM from 'react-dom/client';

import { CountryInput } from './CountryInput';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <CountryInput />
  </React.StrictMode>
);
