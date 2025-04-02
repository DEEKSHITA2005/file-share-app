import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FileUp, Files, Share2, Menu } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import UploadPage from './pages/UploadPage';
import ViewFilesPage from './pages/ViewFilesPage';
import ShareFilePage from './pages/ShareFilePage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Files className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-800">DocShare</span>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              {/* Desktop navigation */}
              <div className="hidden md:flex md:items-center md:space-x-6">
                <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600">
                  <FileUp className="h-5 w-5 mr-1" />
                  <span>Upload</span>
                </Link>
                <Link to="/view" className="flex items-center text-gray-600 hover:text-blue-600">
                  <Files className="h-5 w-5 mr-1" />
                  <span>View Files</span>
                </Link>
                <Link to="/share" className="flex items-center text-gray-600 hover:text-blue-600">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span>Share</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50">Upload</Link>
              <Link to="/view" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50">View Files</Link>
              <Link to="/share" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50">Share</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/view" element={<ViewFilesPage />} />
            <Route path="/share" element={<ShareFilePage />} />
          </Routes>
        </main>

        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
