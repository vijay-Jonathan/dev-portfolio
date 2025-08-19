export interface Certification {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  url?: string;
  badgeImg?: string;
  badgeAlt?: string;
}

export const certifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'AWS Certified DevOps Engineer – Professional',
    issuer: 'Amazon Web Services',
    badgeImg: 'https://img.shields.io/badge/AWS-DevOps_Professional-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS badge'
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    badgeImg: 'https://img.shields.io/badge/AWS-Cloud_Practitioner-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS badge'
  },
  {
    id: 'cert-3',
    title: 'Databricks Certified Data Engineer',
    issuer: 'Databricks',
    badgeImg: 'https://img.shields.io/badge/Databricks-Data_Engineer-FF3621?logo=databricks&logoColor=white',
    badgeAlt: 'Databricks badge'
  },
  {
    id: 'cert-4',
    title: 'DevOps Essentials',
    issuer: 'Coursera',
    badgeImg: 'https://img.shields.io/badge/Coursera-DevOps_Essentials-0056D2?logo=coursera&logoColor=white',
    badgeAlt: 'Coursera badge'
  },
  {
    id: 'cert-5',
    title: 'AWS Certified Developer – Associate',
    issuer: 'Amazon Web Services',
    badgeImg: 'https://img.shields.io/badge/AWS-Developer_Associate-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS badge'
  }
];
