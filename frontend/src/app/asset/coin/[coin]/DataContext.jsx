'use client'
// DataContext.js
import { createContext, useContext, useState } from 'react';

// Initialize context
const DataContext = createContext();

// Context provider component
export function DataProvider({ children, initialData }) {
  const [data, setData] = useState(initialData);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to access the context
export function useData() {
  return useContext(DataContext);
}
