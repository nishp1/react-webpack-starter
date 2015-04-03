import assign from 'object-assign';

if (!Object.assign) {
    Object.assign = assign;
}

import React from 'react';
import App from './App.jsx';
import Routes from './Routes.jsx';
import Router from 'react-router';
import '../styles/main.scss';

window.React = React;

Router.run(Routes, function(Handler) {
    React.render(<App />, document.getElementById('main'));
});
