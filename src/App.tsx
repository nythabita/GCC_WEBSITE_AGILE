import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import LearnPage from "./pages/LearnPage";
import ApplyPage from "./pages/ApplyPage";
import GrowPage from "./pages/GrowPage";
import HomePageLoader from "./pages/HomePageLoader";
import DiscoverPage from "./pages/DiscoverPage";
import AssessmentPage from "./pages/AssessmentPage";
import ProgramsPage from "./pages/ProgramsPage";
import GrowthXPage from "./pages/GrowthXPage";
import GrowthConnectPage from "./pages/GrowthConnectPage";
import GrowthCampPage from "./pages/GrowthCampPage";
import LoginPage from "./pages/LoginPage";
import ProgramForm from "./components/form/ProgramForm";
import { growthxForm } from "./data/forms/growthx-form";
import { growthconnectForm } from "./data/forms/growthconnect-form";
import { growthcampForm } from "./data/forms/growthcamp-form";
import RequireAuth from "./auth/RequireAuth";

// Scroll to the hash target after client-side navigation (e.g. the drawer's "/#programs" link).
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  // The login flow is a full-screen experience (own back link, no site navbar/footer), as in the Figma export.
  const bare = useLocation().pathname === "/login";
  return (
    <>
      <ScrollToHash />
      {!bare && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePageLoader />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/grow" element={<GrowPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<Navigate to="/discover" replace />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/pilih-program" element={<Navigate to="/assessment" replace />} />
        <Route path="/learn/growthcamp" element={<GrowthCampPage />} />
        <Route path="/learn/growthcamp/form" element={<RequireAuth><ProgramForm config={growthcampForm} /></RequireAuth>} />
        <Route path="/apply/growthx" element={<GrowthXPage />} />
        <Route path="/apply/growthx/form" element={<RequireAuth><ProgramForm config={growthxForm} /></RequireAuth>} />
        <Route path="/apply/growthconnect" element={<GrowthConnectPage />} />
        <Route path="/apply/growthconnect/form" element={<RequireAuth><ProgramForm config={growthconnectForm} /></RequireAuth>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<HomePageLoader />} />
      </Routes>
      {!bare && <Footer />}
    </>
  );
}
