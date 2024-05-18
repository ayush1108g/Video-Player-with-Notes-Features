import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AlertProvider } from "./store/AlertContext";
import RoutesComponent from "./components/MainComponent";
import Header from "./components/Header";

function App() {
  return (
    <HashRouter>
      <AnimatePresence>
        <AlertProvider>
          <Header />
          <RoutesComponent />
        </AlertProvider>
      </AnimatePresence>
    </HashRouter>);
}

export default App;
