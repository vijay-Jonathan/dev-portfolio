import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div className="footer-links">
        <a href="https://github.com/vijay-Jonathan" target="_blank" rel="noreferrer" className="footer-social-link"><GitHubIcon/></a>
        <a href="https://www.linkedin.com/in/vmdk/" target="_blank" rel="noreferrer" className="footer-social-link"><LinkedInIcon/></a>
        <a href="mailto:vijaymanidev.kaluri@gmail.com" className="footer-social-link"><EmailIcon/></a>
      </div>
      <p className="footer-text">&copy; {new Date().getFullYear()} Dev Kaluri. All rights reserved.</p>
      <p className="footer-tagline">Built with React & TypeScript</p>
    </footer>
  );
}

export default Footer;