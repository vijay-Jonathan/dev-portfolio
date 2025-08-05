import React, { useState } from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap, faUserGraduate, faTimes } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'
import { timelineData, TimelineData } from '../data/timelineData';

function Timeline() {
  const [selectedItem, setSelectedItem] = useState<TimelineData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleTimelineClick = (item: TimelineData) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  return (
    <div id="history">
      <div className="items-container">
        <h1>Career History</h1>
        <VerticalTimeline>
          {timelineData.map((item) => (
            <VerticalTimelineElement
              key={item.id}
              className="vertical-timeline-element--work timeline-clickable"
              contentStyle={{ 
                background: 'white', 
                color: 'rgb(39, 40, 34)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              contentArrowStyle={{ borderRight: '7px solid white' }}
              date={item.date}
              iconStyle={{ 
                background: item.type === 'education' ? '#6A1B9A' : '#5000ca', 
                color: 'rgb(39, 40, 34)' 
              }}
              icon={
                <FontAwesomeIcon 
                  icon={item.type === 'education' ? 
                    (item.title.includes('Masters') ? faUserGraduate : faGraduationCap) : 
                    faBriefcase
                  } 
                />
              }
              onTimelineElementClick={() => handleTimelineClick(item)}
            >
              <div onClick={() => handleTimelineClick(item)}>
                <h3 className="vertical-timeline-element-title">{item.title}</h3>
                <h4 className="vertical-timeline-element-subtitle">{item.subtitle}</h4>
                <p>{item.description}</p>
                <p className="click-hint">Click for more details</p>
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && selectedItem && (
        <div className="timeline-popup-overlay" onClick={closePopup}>
          <div className="timeline-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>{selectedItem.title}</h2>
              <button className="close-button" onClick={closePopup}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="popup-body">
              <h3>{selectedItem.subtitle}</h3>
              <p className="popup-date">{selectedItem.date}</p>
              <div className="popup-description">
                <h4>Overview:</h4>
                <p>{selectedItem.description}</p>
              </div>
              <div className="popup-detailed-content">
                <h4>Detailed Information:</h4>
                <p>{selectedItem.detailedContent}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timeline;
