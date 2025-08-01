import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClusterList from "./pages/clusterList";
import ClusterDetails from "./pages/clusterDetails";
import Article from "./pages/article";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Index />} />
    
          <Route path="/cluster/:clusterId" element={<ClusterDetails />} />
          <Route path="/article/:articleId" element={<Article />} />

          {/* <Route path="/index" element={<Index />} /> */ }
          {/* <Route path="*" element={<NotFound />} /> */ }
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
