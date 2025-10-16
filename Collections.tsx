import { Router } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import Collections from "../Collections";

export default function CollectionsExample() {
  return (
    <ThemeProvider>
      <Router>
        <Collections />
      </Router>
    </ThemeProvider>
  );
}
