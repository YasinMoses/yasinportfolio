import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

// css
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-calendar/dist/Calendar.css';
import 'react-quill/dist/quill.snow.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'simple-line-icons/css/simple-line-icons.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './scss/react.scss';
import './scss/default/fontstyles.scss';
import './scss/default/demo.scss';
import 'bootstrap-social/bootstrap-social.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import './scss/default/fonts/Cronicon/Cronicon.css';
import './index.css';

// Import the new task page
import AIMLTask from './pages/AIML/AIMLtask';

// ========================================

const store = configureStore();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        {/* Define route for New Task page */}
        <Route path="/AIML/AIMLtasks/new" component={AIMLTask} />
        {/* Default route */}
        <Route path="/" component={App} />
        
      </Switch>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
