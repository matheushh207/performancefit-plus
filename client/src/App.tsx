import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"
import Students from "./pages/Students";
import Evaluations from "./pages/Evaluations";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Recipes from "./pages/Recipes";
import Insights from "./pages/Insights";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import ProfessionalLogin from "./pages/ProfessionalLogin"
import ProfessionalDashboard from "./pages/ProfessionalDashboard"
import StudentAccess from "./pages/StudentAccess";
import StudentPortal from "./pages/StudentPortal";
import StudentWorkout from "./pages/StudentWorkout";
import StudentDiet from "./pages/StudentDiet";
import StudentRecipes from "./pages/StudentRecipes";
import StudentReports from "./pages/StudentReports";


import StudentDetails from "@/pages/StudentDetails";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/students" component={Students} />
      <Route path="/evaluations" component={Evaluations} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/recipes" component={Recipes} />
      <Route path="/insights" component={Insights} />
      <Route path="/admin/panel" component={AdminPanel} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/professional/login" component={ProfessionalLogin} />
      <Route path="/professional/dashboard" component={ProfessionalDashboard} />
      <Route path="/student-access" component={StudentAccess} />
      <Route path="/student-portal" component={StudentPortal} />
      <Route path="/student-workout" component={StudentWorkout} />
      <Route path="/student-diet" component={StudentDiet} />
      <Route path="/student-recipes" component={StudentRecipes} />
      <Route path="/student-reports" component={StudentReports} />
      <Route path="/student/:id" component={StudentDetails} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;