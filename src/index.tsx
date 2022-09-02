import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './css/resets.css';
import './css/variables.css';
import './index.css';

import App from './App';
import { BrowserRouter } from 'react-router-dom';

import './configs/firebase.config'
import { store } from './app/store';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);

