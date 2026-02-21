import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = ({ theme = 'light', user}) => {
  const isDark = theme === 'dark';

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const socialLinks = [
  { 
    name: 'Youtube',
    link: 'https://youtube.com/@acstudycentre?si=-j1tCNbY2iOfZ4KP',
    icon: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z'
  },
{
  name: 'Telegram',
  link: 'https://t.me/acstudycentre30',
  icon: 'M22 3.9l-3.4 16.8a1.1 1.1 0 01-1.64.65l-5-3.7-2.4 2.3a1.1 1.1 0 01-1.18.26l.17-2.4 9.05-8.16a.55.55 0 00-.3-.93L6.22 9.7l-2.43-1a1.1 1.1 0 01.01-1.98L19.7 3.8a1.1 1.1 0 011.94.1z'
},
  { 
    name: 'Instagram',
    link: 'https://www.instagram.com/acstudycentre?igsh=MWc3NTF2eDV6dm84Nw==',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
  },
{
  name: 'Whatsapp',
  link: 'https://chat.whatsapp.com/CUn2buBw1SoEGrH3KwvO5t',
  icon: 'M20.52 3.48a10.2 10.2 0 00-14.43 0 10.26 10.26 0 00-3 7.28c0 1.8.47 3.56 1.37 5.13L3 21l5.07-1.34a10.19 10.19 0 005.13 1.37 10.28 10.28 0 007.29-3 10.2 10.2 0 000-14.55zm-1.47 11.66c-.22.63-1.29 1.22-1.79 1.3a2.92 2.92 0 01-1.3-.22c-.41-.21-1.29-.68-2.13-1.3a7.68 7.68 0 01-2.54-3.16 2.62 2.62 0 01-.09-1.4c.14-.4.61-.69 1.02-.85.23-.1.58-.18.88-.16.3.03.51.1.75.16a.77.77 0 01.43.53c.05.28-.12.58-.22.84a1.44 1.44 0 00-.03 1.03c.15.4.86 1.52 1.87 2.23.94.67 1.4.82 1.73 1 .33.22.54.17.74.1.2-.06.63-.29.72-.57.09-.27.09-.5.06-.57z'
}

];


  return (
    <motion.footer 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={`mt-12 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className={`text-xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                CollegeSecracy
              </span>
            </Link>
            <p className="text-sm">
              Bridging the gap between students and success through personalized mentorship and premium resources.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.link} 
                  className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  aria-label={social.name}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
 <div>
  <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
    Quick Links
  </h3>
  <ul className="space-y-2">
    {[
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      user?.role ? { name: 'Resources', path: `/${user.role}-dashboard/resources` } : null,
      { name: 'Contact', path: '/contact' }
    ]
      .filter(Boolean) // <-- filters out null
      .map((link) => (
        <li key={link.name}>
          <Link
            to={link.path}
            className={`text-sm hover:${isDark ? 'text-orange-400' : 'text-orange-600'} transition-colors`}
          >
            {link.name}
          </Link>
        </li>
      ))}
  </ul>
</div>


          {/* Tools */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              Student Tools
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Rank Calculator', path: `/${user?.role}-dashboard/tools/rank-calculator` },
                { name: 'Percentile Calculator', path: `/${user?.role}-dashboard/tools/percentile-calculator` },
                { name: 'CGPA Calculator', path: `/${user?.role}-dashboard/tools/cgpa-calculator` },
              ].map((tool) => (
                <li key={tool.name}>
                  <Link 
                    to={tool.path} 
                    className={`text-sm hover:${isDark ? 'text-orange-400' : 'text-orange-600'} transition-colors`}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              Contact Us
            </h3>
            <address className="not-italic text-sm space-y-2">
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>helpcollegesecracy@gmail.com</span>
              </div>
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 7234931403</span>
              </div>
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Koni<br />Bilaspur, Chhatisgarh 495009</span>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom section */}
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} CollegeSecracy. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="text-sm hover:underline">Terms of Service</Link>
              <Link to="/refund" className="text-sm hover:underline">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;