import React, { useState } from "react";
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
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
        <span className="section-label">Experience</span>
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
                background: item.type === 'education' ? '#6d28d9' : '#7c3aed', 
                color: '#fff' 
              }}
              icon={item.type === 'education' ? <SchoolIcon /> : <WorkIcon />}
              onTimelineElementClick={() => handleTimelineClick(item)}
            >
              <div onClick={() => handleTimelineClick(item)}>
                <h3 className="vertical-timeline-element-title">{item.title}</h3>
                <h4 className="vertical-timeline-element-subtitle">
                  <span className="company-name">{item.subtitle.split(',')[0]}</span>
                  {item.subtitle.includes(',') && (
                    <span className="company-location">{item.subtitle.substring(item.subtitle.indexOf(',') + 1).trim()}</span>
                  )}
                </h4>
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
                <CloseIcon />
              </button>
            </div>
            <div className="popup-body">
              <h3>{selectedItem.subtitle}</h3>
              <p className="popup-date">{selectedItem.date}</p>
              <div className="popup-description">
                <p>{selectedItem.description}</p>
              </div>
              <div className="popup-detailed-content">
                <h4>Key Highlights:</h4>
                <div dangerouslySetInnerHTML={{ __html: selectedItem.detailedContent }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timeline;
