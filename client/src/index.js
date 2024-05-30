import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware , compose } from 'redux';
import { thunk } from 'redux-thunk';

import reducers from './reducers';

import App from './App';
import './index.css';

const store = createStore(reducers , compose(applyMiddleware(thunk)));

//import { formControlClasses } from '@mui/material';

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);