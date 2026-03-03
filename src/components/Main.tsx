import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Main.scss';
import avatarImg from '../assets/images/myimage.jpg';

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={avatarImg} alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/vijay-Jonathan" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/vmdk/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="mailto:vijaymanidev.kaluri@gmail.com"><EmailIcon/></a>
          </div>
          <h1>Dev Kaluri</h1>
          <p>Software Engineer · AI/ML · Cloud & DevOps</p>

          <div className="mobile_social_icons">
            <a href="https://github.com/vijay-Jonathan" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/vmdk/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="mailto:vijaymanidev.kaluri@gmail.com"><EmailIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;