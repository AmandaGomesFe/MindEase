
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { PreferencesProvider } from './app/context/PreferencesContext';

  createRoot(document.getElementById("root")!).render(
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  );
  