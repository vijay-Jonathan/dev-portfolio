interface TimelineData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  type: 'work' | 'education';
  detailedContent: string;
}

export const timelineData: TimelineData[] = [
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

export type { TimelineData };
