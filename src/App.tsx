import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AdminProvider } from "@/hooks/useAdmin";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AdminRoute } from "@/routes/AdminRoute";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ProfileSetupModal } from "@/components/profile/ProfileSetupModal";

// Pages
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import BlogView from "./pages/BlogView";
import Write from "./pages/Write";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileView from "./pages/ProfileView";
import SavedBlogs from "./pages/SavedBlogs";
import TagView from "./pages/TagView";
import NotFound from "./pages/NotFound";

// Admin Pages
import { 
  AdminDashboard, 
  AdminUsers, 
  AdminBlogs, 
  AdminComments, 
  AdminReports, 
  AdminSecurity, 
  AdminAuditLogs 
} from "./pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Profile setup modal wrapper
 * Shows blocking modal for authenticated users without completed profile
 */
const ProfileSetupModalWrapper = () => {
  const { isAuthenticated, hasCompletedProfile, isLoading, refreshProfile } = useAuth();
  
  // Show modal only when: authenticated + profile NOT completed + not loading
  const showModal = !isLoading && isAuthenticated && !hasCompletedProfile;
  
  return (
    <ProfileSetupModal 
      open={showModal} 
      onComplete={() => {
        // Profile refresh is handled inside the modal
        // This callback is just for additional cleanup if needed
      }} 
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" richColors />
        <BrowserRouter>
          <AuthProvider>
            <AdminProvider>
              <div className="pb-16 md:pb-0">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/blogs" element={<Feed />} />
                  <Route path="/blog/:slug" element={<BlogView />} />
                  <Route path="/u/:username" element={<ProfileView />} />
                  <Route path="/tag/:tagSlug" element={<TagView />} />
                  
                  {/* Protected Routes */}
                  <Route path="/profile/setup" element={
                    <ProtectedRoute requireProfile={false}>
                      <ProfileSetup />
                    </ProtectedRoute>
                  } />
                  <Route path="/write" element={
                    <ProtectedRoute>
                      <Write />
                    </ProtectedRoute>
                  } />
                  <Route path="/write/:id" element={
                    <ProtectedRoute>
                      <Write />
                    </ProtectedRoute>
                  } />
                  <Route path="/saved" element={
                    <ProtectedRoute>
                      <SavedBlogs />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfileView />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes - Server-side verified */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }>
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="comments" element={<AdminComments />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="security" element={<AdminSecurity />} />
                    <Route path="audit" element={<AdminAuditLogs />} />
                  </Route>
                  
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <MobileBottomNav />
              <ProfileSetupModalWrapper />
            </AdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
