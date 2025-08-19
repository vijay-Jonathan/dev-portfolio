import React from 'react';
import '../assets/styles/Certifications.scss';
import { certifications } from '../data/certifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function Certifications() {
  return (
    <div id="certifications">
      <div className="items-container">
        <h1>Certifications</h1>
        <div className="cert-grid">
          {certifications.map((c) => (
            <div className="cert-card" key={c.id}>
              <div className="cert-icon">
                <FontAwesomeIcon icon={faCertificate} />
              </div>
              <div className="cert-content">
                <div className="cert-title-row">
                  <h3 className="cert-title">{c.title}</h3>
                  {c.badgeImg && (
                    <img className="cert-badge" src={c.badgeImg} alt={c.badgeAlt || 'badge'} />
                  )}
                </div>
                {c.issuer && <p className="cert-meta">{c.issuer}</p>}
                {c.date && <p className="cert-meta">{c.date}</p>}
              </div>
              {c.url && (
                <a
                  className="cert-link"
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open certificate for ${c.title}`}
                >
                  <FontAwesomeIcon icon={faUpRightFromSquare} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Certifications;
