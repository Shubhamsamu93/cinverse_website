import React from "react";
import { Routes as ReactRoutes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";

import * as Config from "../constants/Config";

const Routes = () => {
  return (
    <ReactRoutes>
      <Route
        path={`/:category/search/:keyword`}
        element={<Catalog />}
      />
      <Route path={`/:category/:id`} element={<Detail />} />
      <Route path={`/:category`} element={<Catalog />} />
      <Route path={`/`} element={<Home />} />
    </ReactRoutes>
  );
};

export default Routes;
