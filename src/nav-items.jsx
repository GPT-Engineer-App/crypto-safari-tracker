import { Home, Coins, Star } from "lucide-react";
import Index from "./pages/Index.jsx";
import CryptoDetails from "./pages/CryptoDetails.jsx";
import Favorites from "./pages/Favorites.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Star className="h-4 w-4" />,
    page: <Favorites />,
  },
  {
    title: "Crypto Details",
    to: "/crypto/:id",
    icon: <Coins className="h-4 w-4" />,
    page: <CryptoDetails />,
    hideFromNav: true,
  },
];
