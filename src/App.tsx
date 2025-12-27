import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Stores from "./pages/Stores";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import LocationPermission from "./pages/LocationPermission";
import OrderStatus from "./pages/OrderStatus";
import LockerReady from "./pages/LockerReady";
import PickupConfirmed from "./pages/PickupConfirmed";
import LockerSimulation from "./pages/LockerSimulation";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/location-permission" element={<LocationPermission />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/locker-ready" element={<LockerReady />} />
            <Route path="/pickup-confirmed" element={<PickupConfirmed />} />
            <Route path="/locker-simulation" element={<LockerSimulation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
