export interface Certification {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  url?: string;
  badgeImg?: string;
  badgeAlt?: string;
  iconUrl?: string;
  iconAlt?: string;
}

export const certifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'AWS Certified DevOps Engineer – Professional',
    issuer: 'Amazon Web Services',
    badgeImg: 'https://img.shields.io/badge/AWS-DevOps_Professional-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS badge',
    iconUrl: 'https://cdn.simpleicons.org/amazonaws/232F3E',
    iconAlt: 'AWS logo'
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    badgeImg: 'https://img.shields.io/badge/AWS-Cloud_Practitioner-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS badge',
    iconUrl: 'https://cdn.simpleicons.org/amazonaws/232F3E',
    iconAlt: 'AWS logo'
  },
  {
    id: 'cert-3',
    title: 'Databricks Certified Data Engineer',
    issuer: 'Databricks',
    badgeImg: 'https://img.shields.io/badge/Databricks-Data_Engineer-FF3621?logo=databricks&logoColor=white',
    badgeAlt: 'Databricks badge',
    iconUrl: 'https://cdn.simpleicons.org/databricks/FF3621',
    iconAlt: 'Databricks logo'
  },
  {
    id: 'cert-4',
    title: 'DevOps Essentials',
    issuer: 'Coursera',
    badgeImg: 'https://img.shields.io/badge/Coursera-DevOps_Essentials-0056D2?logo=coursera&logoColor=white',
    badgeAlt: 'Coursera badge',
    iconUrl: 'https://cdn.simpleicons.org/coursera/0056D2',
    iconAlt: 'Coursera logo'
  },
  {
    id: 'cert-5',
    title: 'AWS Certified Developer – Associate',
    issuer: 'Amazon Web Services',
    badgeImg: 'https://img.shields.io/badge/AWS-Developer_Associate-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS badge',
    iconUrl: 'https://cdn.simpleicons.org/amazonaws/232F3E',
    iconAlt: 'AWS logo'
  }
];
