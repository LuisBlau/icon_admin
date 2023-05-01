import React, { Suspense, useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";
import Protected from "./protected";

const AppContent = () => {

  const [isSignedIn, setIsSignedIn] = useState(() => {
    const token = localStorage.getItem("token");
    console.log("localStorage: ", token);
    return true
    // return token || false;
  });

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            if (route.isProtected) console.log("isProtected: ", route.name);
            if (route.element && route.isProtected) {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    <Protected isSignedIn={isSignedIn}>
                      <route.element />
                    </Protected>
                  }
                />
              );
            }
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            );
          })}
          {/* <Protected isSignedIn={isSignedIn}>
            <Route path="/dashboard" element={<Navigate to="dashboard" replace />} />
          </Protected> */}
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
