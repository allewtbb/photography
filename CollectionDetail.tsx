import { Router } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import CollectionDetail from "../CollectionDetail";

export default function CollectionDetailExample() {
  return (
    <ThemeProvider>
      <Router>
        <CollectionDetail />
      </Router>
    </ThemeProvider>
  );
}
