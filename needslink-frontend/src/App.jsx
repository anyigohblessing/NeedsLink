import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LandingPage            from './pages/public/LandingPage';
import BrowseOrphanages       from './pages/public/BrowseOrphanages';
import OrphanageProfilePublic from './pages/public/OrphanageProfilePublic';
import { AboutPage, NotFoundPage, UnauthorizedPage } from './pages/public/MiscPages';
import { LoginPage, RegisterPage, ForgotPasswordPage, VerifyEmailPage } from './pages/auth/AuthPages';
import DonorDashboard         from './pages/donor/DonorDashboard';
import { BookmarksPage, ActivityPage } from './pages/donor/DonorPages';
import { OrphanageDashboard, ManageNeedsPage, PostNeedPage, PostUpdatePage } from './pages/orphanage/OrphanagePages';
import { AdminDashboard, VerificationsPage, UserManagementPage } from './pages/admin/AdminPages';
import MessagesPage from './pages/shared/MessagesPage';
import SettingsPage from './pages/shared/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', borderRadius: '12px', border: '1px solid rgba(27,94,32,0.12)' },
            success: { iconTheme: { primary: '#1B5E20', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#B71C1C', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/"               element={<LandingPage />} />
          <Route path="/orphanages"     element={<BrowseOrphanages />} />
          <Route path="/orphanages/:id" element={<OrphanageProfilePublic />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/unauthorized"   element={<UnauthorizedPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route path="/donor/dashboard" element={<ProtectedRoute roles={['donor']}><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/bookmarks" element={<ProtectedRoute roles={['donor']}><BookmarksPage /></ProtectedRoute>} />
          <Route path="/donor/activity"  element={<ProtectedRoute roles={['donor']}><ActivityPage /></ProtectedRoute>} />

          <Route path="/orphanage/dashboard"   element={<ProtectedRoute roles={['orphanage']}><OrphanageDashboard /></ProtectedRoute>} />
          <Route path="/orphanage/needs"       element={<ProtectedRoute roles={['orphanage']}><ManageNeedsPage /></ProtectedRoute>} />
          <Route path="/orphanage/needs/new"   element={<ProtectedRoute roles={['orphanage']}><PostNeedPage /></ProtectedRoute>} />
          <Route path="/orphanage/updates/new" element={<ProtectedRoute roles={['orphanage']}><PostUpdatePage /></ProtectedRoute>} />

          <Route path="/admin/dashboard"     element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/verifications" element={<ProtectedRoute roles={['admin']}><VerificationsPage /></ProtectedRoute>} />
          <Route path="/admin/users"         element={<ProtectedRoute roles={['admin']}><UserManagementPage /></ProtectedRoute>} />

          <Route path="/messages" element={<ProtectedRoute roles={['donor','orphanage','admin']}><MessagesPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute roles={['donor','orphanage','admin']}><SettingsPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
