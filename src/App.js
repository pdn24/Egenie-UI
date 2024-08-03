import React from "react";
import { BrowserRouter } from 'react-router-dom';
import "./index.css";
import AppRouter from './components/router/AppRouter';
import { UserProvider } from "./context/userInfoProvider";

const App = () => (
  <UserProvider>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </UserProvider>
);

export default App;
