// admin/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import AdminProvider from "./context/AdminContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <AdminProvider>
         
              <App />
           
          </AdminProvider>
        </AppContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);