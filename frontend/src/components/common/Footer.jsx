import { Link } from "react-router-dom";
import { FileText, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Resume<span className="text-blue-500">IQ</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Analyze. Improve. Get Hired.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-400 hover:text-blue-400">
                  Upload Resume
                </Link>
              </li>
              <li>
                <Link
                  to="/analysis"
                  className="text-gray-400 hover:text-blue-400"
                >
                  Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/builder"
                  className="text-gray-400 hover:text-blue-400"
                >
                  Resume Builder
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Resume Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Interview Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  Career Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          © {currentYear} ResumeIQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
