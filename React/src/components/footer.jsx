import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Function to handle the scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add scroll event listener to show/hide the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer className="bg-gray-700 py-6 md:py-4 text-white relative">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 mb-3">

          {/* Left Column: Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold mb-3 text-blue-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-blue-300 transition-colors">Home</a></li>
              <li><a href="/scholarships" className="hover:text-blue-300 transition-colors">Scholarships</a></li>
              <li><a href="/my-scholarships" className="hover:text-blue-300 transition-colors">My Scholarships</a></li>
              <li><a href="/faq" className="hover:text-blue-300 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Center Column: Project Info */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-3 text-blue-300">Scholar Hunt</h3>
            <p className="mb-2">Information Systems Web Project</p>
            <p className="mb-2">Semester 6 - 2025</p>
            <p className="text-sm mt-3 text-gray-300">Built with React, Tailwind CSS</p>
          </div>

          {/* Right Column: Team & Contact */}
          <div className="text-center sm:text-right md:text-center">
            <h3 className="text-lg font-bold mb-3 text-blue-300">Connect with us</h3>
            <div className="mt-3 flex justify-center sm:justify-end md:justify-center space-x-5">
              <a href="https://github.com/Project-ScholarHunt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <i className="ri-github-fill text-xl sm:text-2xl"></i>
              </a>
              <a href="mailto:team@example.com" className="hover:text-blue-300 transition-colors">
                <i className="ri-mail-fill text-xl sm:text-2xl"></i>
              </a>
            </div>

            {/* Back to Top Button */}
            <div className="mt-4 md:mt-6 flex justify-center sm:justify-end md:justify-center">
              <button
                onClick={scrollToTop}
                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center transition-all duration-300 ${showTopBtn ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                aria-label="Back to top"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path>
                </svg>
                <span className="text-sm sm:text-base font-medium">Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-4 border-t border-gray-600 text-xs sm:text-sm text-center text-gray-300">
          <p>© 2025 Scholar Hunt Team. All Rights Reserved.</p>
          <p className="mt-1 flex justify-center flex-wrap gap-x-1">
            <a href="/privacy-policy" className="hover:text-blue-300 transition-colors">Privacy Policy</a>
            <span className="mx-1">|</span>
            <a href="/terms" className="hover:text-blue-300 transition-colors">Terms of Use</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
