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
    date: 'March 2024',
    badgeImg: 'https://img.shields.io/badge/AWS-DevOps_Professional-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS DevOps Professional badge',
    iconUrl: 'https://images.credly.com/images/bd31ef42-d460-493e-8503-39592aaf0458/image.png',
    iconAlt: 'AWS DevOps Professional logo',
    url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/'
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'January 2024',
    badgeImg: 'https://img.shields.io/badge/AWS-Cloud_Practitioner-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS Cloud Practitioner badge',
    iconUrl: 'https://images.credly.com/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png',
    iconAlt: 'AWS Cloud Practitioner logo',
    url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/'
  },
  {
    id: 'cert-3',
    title: 'Databricks Certified Data Engineer',
    issuer: 'Databricks',
    date: 'February 2024',
    badgeImg: 'https://img.shields.io/badge/Databricks-Data_Engineer-FF3621?logo=databricks&logoColor=white',
    badgeAlt: 'Databricks Data Engineer badge',
    iconUrl: 'https://images.credly.com/images/d06ca3f4-c3d4-4948-9c42-67f8d8d5b1a1/image.png',
    iconAlt: 'Databricks Data Engineer logo',
    url: 'https://www.databricks.com/learn/certification/data-engineer'
  },
  {
    id: 'cert-4',
    title: 'DevOps Essentials',
    issuer: 'Coursera',
    date: 'December 2023',
    badgeImg: 'https://img.shields.io/badge/Coursera-DevOps_Essentials-0056D2?logo=coursera&logoColor=white',
    badgeAlt: 'Coursera DevOps badge',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg',
    iconAlt: 'Coursera logo',
    url: 'https://www.coursera.org/learn/devops-essentials'
  },
  {
    id: 'cert-5',
    title: 'AWS Certified Developer – Associate',
    issuer: 'Amazon Web Services',
    date: 'November 2023',
    badgeImg: 'https://img.shields.io/badge/AWS-Developer_Associate-232F3E?logo=amazonaws&logoColor=white',
    badgeAlt: 'AWS Developer Associate badge',
    iconUrl: 'https://images.credly.com/images/b9feab85-1a43-4f6c-99a5-631b88d5461b/image.png',
    iconAlt: 'AWS Developer Associate logo',
    url: 'https://aws.amazon.com/certification/certified-developer-associate/'
  }
];
