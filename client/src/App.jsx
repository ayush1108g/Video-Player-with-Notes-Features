import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AlertProvider } from "./store/AlertContext";
import RoutesComponent from "./components/RoutesComponent";
import Header from "./components/Header";

const App = () => {

  return (
    <div style={{ fontFamily: 'poppins' }}>
      <HashRouter>
        <AnimatePresence mode="wait">
          <AlertProvider>
            <Header />
            <RoutesComponent />
          </AlertProvider>
        </AnimatePresence>
      </HashRouter>
    </div>
  );
}

export default App;
