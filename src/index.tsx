import React from 'react';
import ReactDOM from 'react-dom/client';

import './css/resets.css';
import './css/variables.css';
import './index.css';

import App from './App';
import { BrowserRouter } from 'react-router-dom';

import './configs/firebase.config'

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

