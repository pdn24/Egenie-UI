import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";
import AppRouter from './components/router/AppRouter';
import { UserProvider } from './context/userInfoProvider';

const App = () => (
  <UserProvider>
    <Router>
      <AppRouter />
    </Router>
  </UserProvider>
);

export default App;
