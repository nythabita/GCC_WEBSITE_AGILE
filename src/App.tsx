import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import PreviewPage from "./components/layout/PreviewPage";
import LearnPage from "./pages/LearnPage";
import ApplyPage from "./pages/ApplyPage";
import GrowPage from "./pages/GrowPage";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import AssessmentPage from "./pages/AssessmentPage";
import ProgramsPage from "./pages/ProgramsPage";
import { homepageDraft } from "./data/homepage-draft";

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
  return (
    <>
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage content={homepageDraft} />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/grow" element={<GrowPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<Navigate to="/discover" replace />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/pilih-program" element={<Navigate to="/assessment" replace />} />
        <Route path="/learn/growthcamp" element={<PreviewPage title="GrowthCamp" description="Detail program GrowthCamp sedang disiapkan." />} />
        <Route path="/apply/growthx" element={<PreviewPage title="GrowthX" description="Detail program GrowthX sedang disiapkan." />} />
        <Route path="/apply/growthconnect" element={<PreviewPage title="GrowthConnect" description="Detail program GrowthConnect sedang disiapkan." />} />
        <Route path="/login" element={<PreviewPage title="Login" description="Akses akun anggota sedang disiapkan." />} />
        <Route path="*" element={<HomePage content={homepageDraft} />} />
      </Routes>
      <Footer />
    </>
  );
}
