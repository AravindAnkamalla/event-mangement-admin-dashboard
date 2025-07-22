import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/Events";
import Users from "@/pages/Users";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/events" element={
              <DashboardLayout>
                <Events />
              </DashboardLayout>
            } />
            <Route path="/users" element={
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            } />
            <Route path="/analytics" element={
              <DashboardLayout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </DashboardLayout>
            } />
            <Route path="/settings" element={
              <DashboardLayout>
                <div className="text-center py-12">
                  <h1 className="text-2xl font-bold mb-4">Settings</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </DashboardLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;