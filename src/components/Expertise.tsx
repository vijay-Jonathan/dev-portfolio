import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faDocker, faPython } from '@fortawesome/free-brands-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const expertiseData = [
    {
        icon: faReact,
        title: "Full Stack Development",
        description: "30+ full-stack applications using React, Node.js, Django, and GraphQL — serving 500K+ users with strong proficiency across the full SDLC.",
        labels: ["React", "Node.js", "Angular", "Python", "Django", "FastAPI", "TypeScript", "JavaScript", "Java", "C#", "Go", "GraphQL", "SQL", "MongoDB", "REST API"],
        accent: "#3b82f6",
    },
    {
        icon: faDocker,
        title: "DevOps & Cloud",
        description: "CI/CD pipelines, infrastructure as code with Terraform, and Kubernetes orchestration. Cloud migrations to AWS reducing costs by 40% and deployment times by 70%.",
        labels: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitLab CI/CD", "ArgoCD", "Helm", "Grafana", "Prometheus", "SonarQube", "Git"],
        accent: "#10b981",
    },
    {
        icon: faPython,
        title: "AI / ML & GenAI",
        description: "Production-grade RAG platforms, low-latency LLM serving stacks, AI safety pipelines, and no-code AI workflow builders at enterprise scale.",
        labels: ["Google Vertex AI", "Gemini", "LangChain", "RAG Pipelines", "Milvus", "NVIDIA Triton", "TensorRT-LLM", "vLLM", "Llama Guard", "BLIP-2", "Hugging Face", "LLM Integrations"],
        accent: "#f59e0b",
    }
];

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <span className="section-label">What I Do</span>
            <h1>Expertise</h1>
            <p className="section-subtitle">Specialized in building end-to-end solutions across the modern tech stack</p>
            <div className="skills-grid">
                {expertiseData.map((item, idx) => (
                    <div className="skill" key={idx} style={{ '--card-accent': item.accent } as React.CSSProperties}>
                        <div className="skill-icon-wrapper">
                            <FontAwesomeIcon icon={item.icon} size="2x"/>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className="flex-chips">
                            {item.labels.map((label, index) => (
                                <Chip key={index} className='chip' label={label} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}

export default Expertise;