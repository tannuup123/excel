import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import AboutUsPage from "./AboutUsPage";
import ContactUsPage from "./ContactUsPage";
import CareersPage from "./CareersPage";
import BlogPage from "./BlogPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import TermsOfServicePage from "./TermsOfServicePage";
import DisclaimerPage from "./DisclaimerPage";
import FeaturesPage from "./FeaturesPage";
import PricingPage from "./PricingPage";
import PrivateRoute from "./PrivateRoute";
import Footer from "./Footer";
import ResetPasswordPage from "./ResetPasswordPage";

const App = () => {
  const location = useLocation();

  const hideFooterRoutes = [
    "/user-dashboard",
    "/admin-dashboard",
    "/super-admin",
    "/login",
    "/register",
    "/reset-password"
  ];

  const shouldHideFooter = hideFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <AuthProvider>
      <>
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
            </Route>

            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </div>
        {!shouldHideFooter && <Footer />}
      </>
    </AuthProvider>
  );
};

export default App;