
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-primary">MSCOF</span>
            <span className="ml-1">Formation</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link to="/formations" className="text-sm hover:underline">
              Formations
            </Link>
            <Link to="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link to="/contact" className="text-sm hover:underline">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} MSCOF Formation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
