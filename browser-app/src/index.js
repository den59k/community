import React from 'react';
import ReactDOM from 'react-dom';

import { AuthProvider } from 'providers/auth'
import { WsProvider } from 'providers/ws';
import { RouterProvider } from 'providers/router';
import { ModalWindowProvider } from 'providers/modal-window'

import 'styles/style.sass'
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<React.StrictMode>
		<WsProvider>
			<AuthProvider>
				<RouterProvider>
					<ModalWindowProvider>
						<App />
					</ModalWindowProvider>
				</RouterProvider>
			</AuthProvider>
		</WsProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
