export interface Certification {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export const certifications: Certification[] = [
  { id: 'cert-1', title: 'AWS DevOps Professional' },
  { id: 'cert-2', title: 'AWS Cloud Practitioner' },
  { id: 'cert-3', title: 'Databricks Data Engineer' },
  { id: 'cert-4', title: 'DevOps Essentials — Coursera' },
  { id: 'cert-5', title: 'AWS Developer Associate' },
];
