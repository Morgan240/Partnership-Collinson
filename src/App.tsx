import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "@/pages/Index";

function App() {
  return (
    <LanguageProvider>
      <Index />
    </LanguageProvider>
  );
}

export default App;
