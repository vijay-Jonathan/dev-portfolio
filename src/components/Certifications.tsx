import React from 'react';
import '../assets/styles/Certifications.scss';
import { certifications } from '../data/certifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faUpRightFromSquare, faCalendarAlt, faAward } from '@fortawesome/free-solid-svg-icons';
import awsLogo from '../assets/icons/aws.svg';
import databricksLogo from '../assets/icons/databricks.svg';
import courseraLogo from '../assets/icons/coursera.svg';

function Certifications() {
  const getProviderIcon = (issuer: string) => {
    const issuerLower = issuer.toLowerCase();
    if (issuerLower.includes('amazon') || issuerLower.includes('aws')) {
      return awsLogo;
    } else if (issuerLower.includes('databricks')) {
      return databricksLogo;
    } else if (issuerLower.includes('coursera')) {
      return courseraLogo;
    }
    return null;
  };

  const getProviderColor = (issuer: string) => {
    const issuerLower = issuer.toLowerCase();
    if (issuerLower.includes('amazon') || issuerLower.includes('aws')) {
      return '#232F3E';
    } else if (issuerLower.includes('databricks')) {
      return '#FF3621';
    } else if (issuerLower.includes('coursera')) {
      return '#0056D2';
    }
    return '#5000ca';
  };

  return (
    <div id="certifications">
      <div className="items-container">
        <div className="section-header">
          <h1>
            <FontAwesomeIcon icon={faAward} className="section-icon" />
            Professional Certifications
          </h1>
          <p className="section-subtitle">
            Industry-recognized certifications demonstrating expertise in cloud technologies and DevOps practices
          </p>
        </div>
        
        <div className="cert-grid">
          {certifications.map((cert) => {
            const providerIcon = getProviderIcon(cert.issuer || '');
            const providerColor = getProviderColor(cert.issuer || '');
            
            return (
              <div className="cert-card" key={cert.id}>
                <div className="cert-header">
                  <div className="cert-icon" style={{ borderColor: providerColor }}>
                    {providerIcon ? (
                      <img 
                        className="cert-icon-img" 
                        src={providerIcon} 
                        alt={cert.iconAlt || `${cert.issuer} logo`} 
                      />
                    ) : (
                      <FontAwesomeIcon icon={faCertificate} style={{ color: providerColor }} />
                    )}
                  </div>
                  
                  {cert.url && (
                    <a
                      className="cert-link"
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View certificate for ${cert.title}`}
                      style={{ color: providerColor }}
                    >
                      <FontAwesomeIcon icon={faUpRightFromSquare} />
                    </a>
                  )}
                </div>
                
                <div className="cert-content">
                  <h3 className="cert-title">{cert.title}</h3>
                  
                  {cert.issuer && (
                    <div className="cert-issuer">
                      <FontAwesomeIcon icon={faCertificate} className="meta-icon" />
                      <span>{cert.issuer}</span>
                    </div>
                  )}
                  
                  {cert.date && (
                    <div className="cert-date">
                      <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
                      <span>{cert.date}</span>
                    </div>
                  )}
                  
                  {cert.badgeImg && (
                    <div className="cert-badge-container">
                      <img 
                        className="cert-badge" 
                        src={cert.badgeImg} 
                        alt={cert.badgeAlt || 'Certification badge'} 
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Certifications;
