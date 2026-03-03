import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faDocker, faPython } from '@fortawesome/free-brands-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const labelsFirst = [
    "React",
    "Node.js",
    "Angular",
    "Python",
    "Django",
    "FastAPI",
    "TypeScript",
    "JavaScript",
    "Java",
    "C#",
    "Go",
    "GraphQL",
    "Ruby on Rails",
    "SQL",
    "MySQL",
    "MongoDB",
    "REST API"
];

const labelsSecond = [
    "AWS",
    "GCP",
    "Azure",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Jenkins",
    "GitLab CI/CD",
    "ArgoCD",
    "Helm",
    "Grafana",
    "Prometheus",
    "SonarQube",
    "Shell Scripting",
    "Git",
    "Jira"
];

const labelsThird = [
    "Google Vertex AI",
    "Gemini",
    "LangChain",
    "RAG Pipelines",
    "Milvus",
    "NVIDIA Triton",
    "TensorRT-LLM",
    "vLLM",
    "Llama Guard",
    "BLIP-2",
    "Hugging Face",
    "LLM Integrations"
];

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faReact} size="3x"/>
                    <h3>Full Stack Web Development</h3>
                    <p>I have designed and developed 30+ full stack applications using modern technologies such as React, Node.js, Django, and GraphQL, serving 500K+ users. I have strong proficiency across the full SDLC from frontend development to backend APIs and database design.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsFirst.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faDocker} size="3x"/>
                    <h3>DevOps & Cloud</h3>
                    <p>I build and optimize CI/CD pipelines, automate infrastructure provisioning with Terraform, and orchestrate containerized deployments on Kubernetes. Experienced in cloud migrations to AWS, reducing operational costs by 40% and deployment times by 70%.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsSecond.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faPython} size="3x"/>
                    <h3>AI / ML & GenAI</h3>
                    <p>I architect production-grade RAG platforms, low-latency LLM serving stacks, and AI safety pipelines for enterprise use. Experienced in building no-code AI workflow builders and multi-modal AI solutions at scale.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsThird.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;