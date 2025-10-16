import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import CollectionDetail from "@/pages/CollectionDetail";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import AdminCollectionPhotos from "@/pages/AdminCollectionPhotos";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/collections" component={Collections} />
      <Route path="/collection/:id" component={CollectionDetail} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/collection/:id" component={AdminCollectionPhotos} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Navigation />
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
