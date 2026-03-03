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
    title: 'Software / AI ML Engineer',
    subtitle: 'World Link US, Dallas, TX',
    date: 'April 2025 – Present',
    description: 'Production RAG platforms, LLM serving stacks, AI safety pipelines, and no-code AI workflow builders at enterprise scale.',
    type: 'work',
    detailedContent: `<ul>
<li>Architected a production <strong>RAG platform</strong> with <strong>Milvus</strong> vector search, Corrective RAG, web-search fallback, and LLM-driven query enhancement. Enabled real-time Q&A over <strong>1,000+ documents</strong> with role-based access across multiple enterprise brands</li>
<li>Designed a low-latency <strong>LLM serving stack</strong> using <strong>NVIDIA Triton</strong> with TensorRT-LLM and vLLM (AWQ-quantized Mixtral-8x7B / Llama 3.1). Delivered <strong>sub-second</strong> streamed responses over gRPC and WebSockets at <strong>&lt;60% GPU memory</strong></li>
<li>Built a multi-layer <strong>AI safety pipeline</strong> combining Llama Guard 3-8B, Prompt Guard, fuzzy matching, and <strong>Presidio PII detection</strong>. Generates real-time security scorecards enforcing enterprise compliance</li>
<li>Created a <strong>drag-and-drop AI pipeline builder</strong> with <strong>10+ pluggable modules</strong> (RAG, Text-to-SQL, LLM, NLP, Security), FastAPI backend, and <strong>React/TypeScript</strong> frontend</li>
<li>Developed an automated <strong>ETL pipeline</strong> for multi-format ingestion (PDF, DOCX, MP4 via Whisper), vector indexing in Milvus, and multi-modal AI (BLIP-2, TTS, Twilio IVR). Deployed on <strong>Kubernetes</strong> with CI/CD</li>
</ul>`
  },
  {
    id: '2',
    title: 'M.S. Information Technology and Management',
    subtitle: 'The University of Texas at Dallas',
    date: 'January 2023 – December 2024',
    description: 'Master of Science in Information Technology and Management from UTD.',
    type: 'education',
    detailedContent: `<ul>
<li>Master of Science in <strong>Information Technology and Management</strong></li>
<li>Coursework: Cloud Computing, Software Engineering, Database Management, AI/ML, Enterprise Systems</li>
<li>Hands-on experience through research projects and collaborative development</li>
</ul>`
  },
  {
    id: '3',
    title: 'Software Developer (Full Stack)',
    subtitle: 'University of Texas at Dallas, Dallas, TX',
    date: 'May 2023 – January 2024',
    description: 'Built 30+ full-stack apps with Python, Node.js, React, and GraphQL. Achieved 50% faster API response times.',
    type: 'work',
    detailedContent: `<ul>
<li>Designed and developed <strong>30+ full-stack applications</strong> using <strong>Python (Django)</strong>, Node.js, React, and GraphQL. Widely adopted across the university</li>
<li>Executed comprehensive integration and <strong>end-to-end testing</strong> to ensure code quality, using testing frameworks to identify and resolve issues before deployment</li>
<li>Developed and integrated <strong>RESTful APIs</strong> using Node.js. Achieved <strong>50% reduction</strong> in response time and <strong>30% increase</strong> in overall application performance</li>
</ul>`
  },
  {
    id: '4',
    title: 'Software / DevOps Engineer',
    subtitle: 'Dish Networks, Englewood, CO',
    date: 'June 2021 – January 2023',
    description: 'CI/CD pipelines, AWS cloud migration, Kubernetes orchestration. 70% faster deployments, 40% cost reduction across 30+ teams.',
    type: 'work',
    detailedContent: `<ul>
<li>Optimized <strong>CI/CD pipelines</strong> in Jenkins and GitLab. <strong>70% faster</strong> deployment time, <strong>80% fewer</strong> production issues</li>
<li>Led migration from Bitbucket to <strong>GitLab</strong> and Jenkins to GitLab CI/CD for <strong>30+ teams</strong></li>
<li>Spearheaded <strong>AWS cloud migration</strong> of on-premises applications. <strong>40% reduction</strong> in operational costs</li>
<li>Automated <strong>Docker</strong> container provisioning. <strong>60% faster</strong> environment configuration, consistent dev/staging/prod environments</li>
<li>Integrated <strong>SonarQube</strong> into CI/CD pipelines. <strong>40% reduction</strong> in technical debt</li>
<li>Implemented <strong>Kubernetes</strong> orchestration with <strong>Helm Charts</strong>. <strong>50% faster</strong> deployments, <strong>70% less</strong> manual intervention</li>
<li>Configured <strong>Argo CD</strong> for continuous delivery with automatic rollbacks. <strong>25% faster</strong> recovery from failures</li>
<li>Architected scalable infrastructure on <strong>AWS using Terraform</strong>. <strong>30% improvement</strong> in reliability and scalability</li>
<li>Built monitoring dashboards using <strong>Grafana</strong>, <strong>Prometheus</strong>, and <strong>ELK</strong> stack</li>
</ul>`
  },
  {
    id: '5',
    title: 'Software Engineer',
    subtitle: 'Cognizant, Bangalore, India',
    date: 'March 2021 – June 2021',
    description: 'Full-stack development with React.js and Node.js serving 500K+ users, AWS deployments, and JWT-based security.',
    type: 'work',
    detailedContent: `<ul>
<li>Developed and maintained scalable web applications using <strong>React.js</strong> and <strong>Node.js</strong>, handling RESTful services for <strong>500K+ users</strong></li>
<li>Deployed applications on <strong>AWS</strong> (EC2, S3, RDS). <strong>25% reduction</strong> in deployment times and increased availability</li>
<li>Implemented <strong>JWT-based authentication</strong> and <strong>role-based access control</strong> for secure application access</li>
</ul>`
  },
  {
    id: '6',
    title: 'B.Tech. Computer Science and Engineering',
    subtitle: 'Amrita Vishwa Vidyapeetham, Coimbatore, India',
    date: '2017 – 2021',
    description: 'Bachelor of Technology in Computer Science and Engineering.',
    type: 'education',
    detailedContent: `<ul>
<li>Bachelor of Technology in <strong>Computer Science and Engineering</strong></li>
<li>Foundation in algorithms, data structures, operating systems, database systems, and software engineering</li>
</ul>`
  }
];

export type { TimelineData };
