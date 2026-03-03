import React, { useEffect, useState } from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import '../assets/styles/Main.scss';
import avatarImg from '../assets/images/myimage.jpg';

const roles = [
  "Software Engineer",
  "AI/ML Engineer",
  "Cloud & DevOps Specialist",
  "Full Stack Developer",
];

function Main() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timeout = setTimeout(() => {
        setText(currentRole.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, isDeleting ? 40 : 80);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  const scrollToExpertise = () => {
    document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div className="about-section">
        {/* Animated mesh gradient orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid" />

        <div className="hero-content-wrapper">
          <div className="content">
            <div className="hero-top-row">
              <div className="hero-avatar">
                <img src={avatarImg} alt="Dev Kaluri" />
              </div>
              <div className="hero-badge">
                <span className="badge-dot" />
                <span>Available for opportunities</span>
              </div>
            </div>

            <h1 className="hero-name">
              Dev Kaluri
            </h1>

            <div className="typing-wrapper">
              <span className="typing-text">{text}</span>
              <span className="typing-cursor">|</span>
            </div>

            <p className="hero-tagline">
              Engineering AI-powered systems, architecting DevOps &amp; cloud infrastructure, 
              and crafting full-stack applications at scale for 8M+ users.
            </p>

            <div className="hero-cta">
              <a href="#contact" className="cta-button cta-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <EmailIcon /> Get in Touch
              </a>
              <a href="#expertise" className="cta-button cta-secondary" onClick={(e) => { e.preventDefault(); scrollToExpertise(); }}>
                View My Work <ArrowDownwardIcon />
              </a>
            </div>

            <div className="hero-social">
              <a href="https://github.com/vijay-Jonathan" target="_blank" rel="noreferrer" className="social-link">
                <GitHubIcon />
              </a>
              <a href="https://www.linkedin.com/in/vmdk/" target="_blank" rel="noreferrer" className="social-link">
                <LinkedInIcon />
              </a>
              <a href="mailto:vijaymanidev.kaluri@gmail.com" className="social-link">
                <EmailIcon />
              </a>
            </div>
          </div>

          <div className="hero-stats-strip">
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Applications Built</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">8M+</span>
              <span className="stat-label">Users Served</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator" onClick={scrollToExpertise}>
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          <span>Scroll</span>
        </div>
      </div>
    </div>
  );
}

export default Main;