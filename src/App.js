import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { routes } from "./components/Routes/Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {routes &&
            routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                ></Route>
              );
            })}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
