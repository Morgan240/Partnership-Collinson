import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "@/pages/Index";
import { LoginPage } from "@/simulator/pages/LoginPage";
import { WaitlistPage } from "@/simulator/pages/WaitlistPage";
import { WaitlistPage4D } from "@/simulator/pages/WaitlistPage4D";
import { PriModelAboutPage } from "@/simulator/pages/PriModelAboutPage";
import { BenchmarkPage } from "@/simulator/pages/BenchmarkPage";
import { SimulatorLayout } from "@/simulator/components/SimulatorLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route
          path="/"
          element={
            <LanguageProvider>
              <Index />
            </LanguageProvider>
          }
        />

        {/* Simulator */}
        <Route path="/LMS/login" element={<LoginPage />} />
        <Route path="/LMS" element={<SimulatorLayout />}>
          <Route index element={<Navigate to="/LMS/login" replace />} />
          <Route path="waitlist" element={<WaitlistPage />} />
          <Route path="waitlist4d" element={<WaitlistPage4D />} />
          <Route path="about" element={<PriModelAboutPage />} />
          <Route path="benchmark" element={<BenchmarkPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
