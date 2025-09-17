import React from 'react';
import '../assets/styles/Certifications.scss';
import { certifications } from '../data/certifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function Certifications() {
  const getProviderIcon = (issuer: string) => {
    const issuerLower = issuer.toLowerCase();
    if (issuerLower.includes('amazon') || issuerLower.includes('aws')) {
      return 'https://images.credly.com/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png'; // AWS Cloud Practitioner
    } else if (issuerLower.includes('databricks')) {
      return 'https://www.databricks.com/wp-content/uploads/2021/10/db-nav-logo.svg'; // Databricks logo
    } else if (issuerLower.includes('coursera')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg';
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
        <h1>Certifications</h1>
        
        <div className="cert-grid">
          {certifications.map((cert) => {
            const providerIcon = getProviderIcon(cert.issuer || '');
            const providerColor = getProviderColor(cert.issuer || '');
            
            return (
              <div className="cert-card" key={cert.id}>
                <div className="cert-main">
                  <div className="cert-icon">
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
                  
                  <div className="cert-info">
                    <h3 className="cert-title">{cert.title}</h3>
                    <div className="cert-meta">
                      <span className="cert-issuer">{cert.issuer}</span>
                      {cert.date && <span className="cert-date">{cert.date}</span>}
                    </div>
                  </div>
                  
                  {cert.url && (
                    <a
                      className="cert-verify-btn"
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Verify certificate for ${cert.title}`}
                      title="Verify Credential"
                    >
                      <FontAwesomeIcon icon={faUpRightFromSquare} />
                    </a>
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
