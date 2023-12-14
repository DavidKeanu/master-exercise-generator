import React, { createContext, useState } from 'react';
import {CircleSpinnerOverlay} from "react-spinner-overlay";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  /**
   * Is the application loading
   */
  const [loading, setLoading] = useState(false);

  /**
   * Current session
   */
  const [sitzungsId, setSitzungsId] = useState(null);

  return (
    <AppContext.Provider value={{ loading, setLoading, sitzungsId, setSitzungsId }}>
      <CircleSpinnerOverlay loading={loading} overlayColor={'rgba(0,0,0,0.4)'}/>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;