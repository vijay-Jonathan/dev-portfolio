import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/vijay-Jonathan" target="_blank" rel="noreferrer"><GitHubIcon/></a>
        <a href="https://www.linkedin.com/in/vmdk/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
        <a href="mailto:vijaymanidev.kaluri@gmail.com"><EmailIcon/></a>
      </div>
      <p>&copy; {new Date().getFullYear()} Vijay Mani Dev Kaluri. All rights reserved.</p>
    </footer>
  );
}

export default Footer;