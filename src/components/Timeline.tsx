import React, { useState } from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faGraduationCap, faUserGraduate, faTimes } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'

interface TimelineData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  type: 'work' | 'education';
  detailedContent: string;
}

function Timeline() {
  const [selectedItem, setSelectedItem] = useState<TimelineData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const timelineData: TimelineData[] = [
    {
      id: '1',
      title: 'Software Engineer/ AI Engineer',
      subtitle: 'Dallas, TX',
      date: '2022 April - present',
      description: 'Full-stack Web Development, GenAI/LLM, Cloud Computing, API Development, AI/ML Integration',
      type: 'work',
      detailedContent: 'Detailed information about this role will be provided by the user. This is placeholder content for the popup modal.'
    },
    {
      id: '2',
      title: 'Computer Science',
      subtitle: 'Dallas, TX',
      date: '2023 January - 2024 December',
      description: 'Masters in Computer Science, GPA: 3.8/4.0',
      type: 'education',
      detailedContent: 'Detailed information about this education will be provided by the user. This is placeholder content for the popup modal.'
    },
    {
      id: '3',
      title: 'Software Developer (Full stack)',
      subtitle: 'Dallas, TX',
      date: 'June 2023 – January 2024',
      description: 'Frontend Development, Backend Development, User Experience, Team Leading',
      type: 'work',
      detailedContent: 'Detailed information about this role will be provided by the user. This is placeholder content for the popup modal.'
    },
    {
      id: '4',
      title: 'Software/ DevOps Engineer',
      subtitle: 'Englewood, CO',
      date: 'June 2021 – January 2023',
      description: 'Frontend Development, Backend Development, User Experience, Team Leading',
      type: 'work',
      detailedContent: 'Detailed information about this role will be provided by the user. This is placeholder content for the popup modal.'
    },
    {
      id: '5',
      title: 'Full-stack Developer',
      subtitle: 'Banglore, IN',
      date: 'Mar 2021 - Jun 2021',
      description: 'Full-stack Development, API Development, User Experience',
      type: 'work',
      detailedContent: 'Detailed information about this role will be provided by the user. This is placeholder content for the popup modal.'
    },
    {
      id: '6',
      title: 'Computer Science and Engeneering',
      subtitle: 'Coimbatore, India',
      date: '2017 - 2021',
      description: 'Bachelor of Technology in Computer Science and Engineering, GPA: 3.8/4.0',
      type: 'education',
      detailedContent: 'Detailed information about this education will be provided by the user. This is placeholder content for the popup modal.'
    }
  ];

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