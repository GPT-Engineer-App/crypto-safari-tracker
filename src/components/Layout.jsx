import { Link } from "react-router-dom";
import { navItems } from "../nav-items";
import { Terminal } from "lucide-react";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-purple-300">
      <nav className="bg-purple-900 text-purple-100 p-4 border-b border-purple-700">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <Terminal className="mr-2" />
            <span className="font-mono">CryptoHack</span>
          </Link>
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-purple-400 flex items-center font-mono">
                  {item.icon}
                  <span className="ml-1">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-purple-900 text-purple-300 p-4 mt-8 border-t border-purple-700">
        <div className="container mx-auto text-center font-mono">
          <p>&copy; 2024 CryptoHack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
