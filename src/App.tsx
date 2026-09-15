import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { MapPage } from '@/pages/MapPage';
import { RiskIntelligence } from '@/pages/RiskIntelligence';
import { ProblemMemory } from '@/pages/ProblemMemory';
import { IncidentsPage } from '@/pages/IncidentsPage';
import { IncidentDetail } from '@/pages/IncidentDetail';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { DatasetsPage } from '@/pages/DatasetsPage';
import { MethodologyPage } from '@/pages/MethodologyPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SubmitObservation } from '@/pages/SubmitObservation';
import { LoginPage } from '@/pages/LoginPage';
import type { UserRole } from '@/types';
import type { ReactNode } from 'react';

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/submit-observation" element={<SubmitObservation />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/risk" element={<ProtectedRoute roles={['admin', 'planner', 'disaster']}><RiskIntelligence /></ProtectedRoute>} />
        <Route path="/problem-memory" element={<ProblemMemory />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/analysis" element={<ProtectedRoute roles={['admin', 'planner', 'disaster']}><AnalysisPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={['admin', 'planner', 'disaster']}><ReportsPage /></ProtectedRoute>} />
        <Route path="/datasets" element={<ProtectedRoute roles={['admin']}><DatasetsPage /></ProtectedRoute>} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/settings" element={<ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
