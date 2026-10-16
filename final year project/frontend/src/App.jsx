import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ImpactPage } from './pages/ImpactPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyDocumentsPage } from './pages/MyDocumentsPage';
import { ChatPage } from './pages/ChatPage';
import { StudyToolsPage } from './pages/StudyToolsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Teacher Imports
import { TeacherLayout } from './layouts/TeacherLayout';
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { QuestionPaperPage } from './pages/teacher/QuestionPaperPage';
import { AssignmentPage } from './pages/teacher/AssignmentPage';
import { LessonPlanPage } from './pages/teacher/LessonPlanPage';
import { PerformanceAnalyzerPage } from './pages/teacher/PerformanceAnalyzerPage';
import { EvaluationPage } from './pages/teacher/EvaluationPage';
import { TeachingMaterialPage } from './pages/teacher/TeachingMaterialPage';

// Researcher Imports
import { ResearcherLayout } from './layouts/ResearcherLayout';
import { ResearcherDashboardPage } from './pages/researcher/ResearcherDashboardPage';
import { PaperAnalyzerPage } from './pages/researcher/PaperAnalyzerPage';
import { LitReviewPage } from './pages/researcher/LitReviewPage';
import { GapFinderPage } from './pages/researcher/GapFinderPage';
import { ComparisonPage } from './pages/researcher/ComparisonPage';
import { CitationPage } from './pages/researcher/CitationPage';
import { DataAnalyzerPage as ResearcherDataAnalyzerPage } from './pages/researcher/DataAnalyzerPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/workflow" element={<HowItWorksPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Universal Protected Routes - accessible by ALL logged-in roles */}
            <Route element={<ProtectedRoute />}>
              <Route path="/documents" element={<MyDocumentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_USER']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/tools" element={<StudyToolsPage />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_TEACHER']} />}>
              <Route path="/teacher" element={<TeacherLayout />}>
                <Route index element={<TeacherDashboardPage />} />
                <Route path="question-paper" element={<QuestionPaperPage />} />
                <Route path="assignment" element={<AssignmentPage />} />
                <Route path="lesson-plan" element={<LessonPlanPage />} />
                <Route path="performance" element={<PerformanceAnalyzerPage />} />
                <Route path="evaluation" element={<EvaluationPage />} />
                <Route path="material" element={<TeachingMaterialPage />} />
                <Route path="history" element={<HistoryPage title="Teacher Generations" />} />
              </Route>
            </Route>

            {/* Researcher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_RESEARCHER']} />}>
              <Route path="/researcher" element={<ResearcherLayout />}>
                <Route index element={<ResearcherDashboardPage />} />
                <Route path="paper-analyzer" element={<PaperAnalyzerPage />} />
                <Route path="literature-review" element={<LitReviewPage />} />
                <Route path="gap-finder" element={<GapFinderPage />} />
                <Route path="comparison" element={<ComparisonPage />} />
                <Route path="citation" element={<CitationPage />} />
                <Route path="data-analyzer" element={<ResearcherDataAnalyzerPage />} />
                <Route path="history" element={<HistoryPage title="Researcher Generations" />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


