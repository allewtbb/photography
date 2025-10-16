import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "../ThemeProvider";
import Navigation from "../Navigation";
import { Router } from "wouter";

export default function NavigationExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Navigation />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
