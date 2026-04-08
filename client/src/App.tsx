/*
 * ORIZON — Gestão Viva
 * App.tsx: Roteamento principal com autenticação e layout
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vendas from "./pages/Vendas";
import Colaboradores from "./pages/Colaboradores";
import Recrutamento from "./pages/Recrutamento";
import Onboarding from "./pages/Onboarding";
import Treinamentos from "./pages/Treinamentos";
import Ponto from "./pages/Ponto";
import DPDigital from "./pages/DPDigital";
import Clima from "./pages/Clima";
import Avaliacao from "./pages/Avaliacao";
import Saude from "./pages/Saude";
import Feed from "./pages/Feed";
import Agenda from "./pages/Agenda";
import IAAssistente from "./pages/IAAssistente";
import AdminMaster from "./pages/AdminMaster";
import AppLayout from "./components/layout/AppLayout";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/vendas">
        <ProtectedRoute component={Vendas} />
      </Route>
      <Route path="/colaboradores">
        <ProtectedRoute component={Colaboradores} />
      </Route>
      <Route path="/recrutamento">
        <ProtectedRoute component={Recrutamento} />
      </Route>
      <Route path="/onboarding">
        <ProtectedRoute component={Onboarding} />
      </Route>
      <Route path="/treinamentos">
        <ProtectedRoute component={Treinamentos} />
      </Route>
      <Route path="/ponto">
        <ProtectedRoute component={Ponto} />
      </Route>
      <Route path="/dp-digital">
        <ProtectedRoute component={DPDigital} />
      </Route>
      <Route path="/clima">
        <ProtectedRoute component={Clima} />
      </Route>
      <Route path="/avaliacao">
        <ProtectedRoute component={Avaliacao} />
      </Route>
      <Route path="/metas">
        <ProtectedRoute component={Avaliacao} />
      </Route>
      <Route path="/saude">
        <ProtectedRoute component={Saude} />
      </Route>
      <Route path="/feed">
        <ProtectedRoute component={Feed} />
      </Route>
      <Route path="/agenda">
        <ProtectedRoute component={Agenda} />
      </Route>
      <Route path="/kanban">
        <ProtectedRoute component={Agenda} />
      </Route>
      <Route path="/ia">
        <ProtectedRoute component={IAAssistente} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={AdminMaster} />
      </Route>
      {/* Placeholder routes */}
      <Route path="/notificacoes">
        <ProtectedRoute component={Feed} />
      </Route>
      <Route path="/cultura">
        <ProtectedRoute component={Clima} />
      </Route>
      <Route path="/reunioes">
        <ProtectedRoute component={Agenda} />
      </Route>
      <Route path="/seguranca">
        <ProtectedRoute component={AdminMaster} />
      </Route>
      <Route path="/configuracoes">
        <ProtectedRoute component={AdminMaster} />
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
