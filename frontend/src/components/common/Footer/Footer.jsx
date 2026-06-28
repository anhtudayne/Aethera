import { Link } from 'react-router-dom';
import { Sparkles, Globe } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Column 1: About */}
        <div className="footer-col footer-about">
          <Link to={ROUTES.HOME} className="footer-logo">
            <Sparkles size={20} />
            <span>Aethera</span>
          </Link>
          <p className="footer-tagline">
            Where knowledge is refined, experience is enhanced — Your learning journey begins here.
          </p>
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li>
              <Link to={ROUTES.COURSES}>All Courses</Link>
            </li>
            <li>
              <Link to={`${ROUTES.COURSES}?sort=popular`}>Popular Courses</Link>
            </li>
            <li>
              <Link to={`${ROUTES.COURSES}?sort=newest`}>New Arrivals</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div className="footer-col">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li>
              <a href="#help">Help Center</a>
            </li>
            <li>
              <a href="#terms">Terms of Service</a>
            </li>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact Us</h4>
          <address className="footer-address">
            <p>Email: support@aethera.edu</p>
            <p>Hotline: 1900 8198</p>
            <p>University of Information Technology, HCMC</p>
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="footer-copyright">
            &copy; {currentYear} Aethera. All rights reserved. Built with passion for excellence.
          </p>
          <div className="footer-language">
            <Globe size={16} />
            <span>English / Vietnamese</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
