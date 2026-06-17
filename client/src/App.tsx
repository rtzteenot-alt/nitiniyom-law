import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClients from "./pages/admin/Clients";
import AdminCases from "./pages/admin/Cases";
import AdminAppointments from "./pages/admin/Appointments";
import AdminMessages from "./pages/admin/Messages";
import AdminInvoices from "./pages/admin/Invoices";
import AdminLogin from "./pages/admin/Login";
import AdminTools from "./pages/admin/Tools";
import InterestCalculator from "./pages/admin/InterestCalculator";
import Team from "./pages/Team";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import RevengePortnArticle from "./pages/RevengePortnArticle";
import Services from "./pages/Services";
import Tools from "./pages/Tools";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/team" component={Team} />
        <Route path="/services" component={Services} />
        <Route path="/tools" component={Tools} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/revenge-porn" component={RevengePortnArticle} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/clients" component={AdminClients} />
        <Route path="/admin/cases" component={AdminCases} />
        <Route path="/admin/appointments" component={AdminAppointments} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/invoices" component={AdminInvoices} />
        <Route path="/admin/tools" component={AdminTools} />
        <Route path="/admin/interest-calculator" component={InterestCalculator} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  useEffect(() => {
    // Add Organization Schema Markup
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'สำนักงานกฎหมายนิตินิยม',
      'description': 'สำนักงานกฎหมายนิตินิยม ให้คำปรึกษากฎหมายอาญา กฎหมายแพ่ง การทำสัญญา ทวงถามหนี้ และปรึกษาเบื้องต้น',
      'url': 'https://nitiniyomlaw.space',
      'telephone': '061-590-9678',
      'email': 'niyomphakjira@gmail.com',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '398 บ้านเรียงแฮ่ไต้ ต.นิคมสร้างเนื้อสำโคมน้อย',
        'addressLocality': 'อุบลราชธานี',
        'addressRegion': 'อุบลราชธานี',
        'postalCode': '34350',
        'addressCountry': 'TH'
      },
      'sameAs': [
        'https://web.facebook.com/profile.php?id=100095300137230'
      ]
    });
    document.head.appendChild(schemaScript);

    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
