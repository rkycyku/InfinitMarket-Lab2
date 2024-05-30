import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useRoutes } from 'react-router-dom';
import routes, { renderRoutes } from './routes';

import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <React.Fragment>
      <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}>{renderRoutes(routes)}</BrowserRouter>
    </React.Fragment>
  );
  
};

export default App;
