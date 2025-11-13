// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          {/* Optional devtools for debugging */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);