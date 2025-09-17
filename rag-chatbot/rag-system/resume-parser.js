class ResumeParser {
    constructor() {
        this.resumeData = {
            rawText: '',
            sections: {
                personalInfo: {},
                education: [],
                experience: [],
                skills: [],
                projects: [],
                certifications: [],
                achievements: []
            }
        };
    }

    async parseResume(file) {
        try {
            // Extract raw text based on file type
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                this.resumeData.rawText = await this.extractTextFromPDF(file);
            } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
                this.resumeData.rawText = await this.extractTextFromDOCX(file);
            } else {
                throw new Error('Unsupported file format');
            }

            // Parse the text into structured sections
            this.parseStructuredData();
            
            return this.resumeData;
        } catch (error) {
            console.error('Error parsing resume:', error);
            throw error;
        }
    }

    async extractTextFromPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const typedarray = new Uint8Array(e.target.result);
                    
                    // Configure PDF.js worker
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let fullText = '';
                    
                    // Extract text from all pages
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    
                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async extractTextFromDOCX(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    resolve(result.value);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    parseStructuredData() {
        const text = this.resumeData.rawText.toLowerCase();
        const lines = this.resumeData.rawText.split('\n').filter(line => line.trim());
        
        // Extract personal information
        this.extractPersonalInfo(lines);
        
        // Extract education
        this.extractEducation(lines);
        
        // Extract work experience
        this.extractExperience(lines);
        
        // Extract skills
        this.extractSkills(lines);
        
        // Extract projects
        this.extractProjects(lines);
        
        // Extract certifications
        this.extractCertifications(lines);
    }

    extractPersonalInfo(lines) {
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
        const phoneRegex = /(\+?[\d\s\-\(\)]{10,})/;
        const linkedinRegex = /(linkedin\.com\/in\/[^\s]+)/i;
        const githubRegex = /(github\.com\/[^\s]+)/i;

        for (const line of lines) {
            const email = line.match(emailRegex);
            if (email) this.resumeData.sections.personalInfo.email = email[1];

            const phone = line.match(phoneRegex);
            if (phone && !this.resumeData.sections.personalInfo.phone) {
                this.resumeData.sections.personalInfo.phone = phone[1];
            }

            const linkedin = line.match(linkedinRegex);
            if (linkedin) this.resumeData.sections.personalInfo.linkedin = linkedin[1];

            const github = line.match(githubRegex);
            if (github) this.resumeData.sections.personalInfo.github = github[1];
        }

        // Extract name (usually first non-empty line)
        if (lines.length > 0) {
            this.resumeData.sections.personalInfo.name = lines[0].trim();
        }
    }

    extractEducation(lines) {
        const educationKeywords = ['education', 'academic', 'university', 'college', 'school', 'degree', 'bachelor', 'master', 'phd', 'diploma'];
        const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'associate', 'diploma', 'certificate'];
        
        let inEducationSection = false;
        let currentEducation = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            // Check if we're entering education section
            if (educationKeywords.some(keyword => line.includes(keyword)) && line.length < 50) {
                inEducationSection = true;
                continue;
            }

            // Check if we're leaving education section
            if (inEducationSection && this.isSectionHeader(line)) {
                inEducationSection = false;
                continue;
            }

            if (inEducationSection || degreeKeywords.some(keyword => line.includes(keyword))) {
                const education = this.parseEducationEntry(lines[i]);
                if (education) {
                    this.resumeData.sections.education.push(education);
                }
            }
        }
    }

    parseEducationEntry(line) {
        const degreeRegex = /(bachelor|master|phd|doctorate|associate|diploma|certificate).*?(in|of)?\s*([^,\n]+)/i;
        const yearRegex = /(\d{4})/g;
        const institutionRegex = /(university|college|institute|school)\s+([^,\n]+)/i;

        const degree = line.match(degreeRegex);
        const years = line.match(yearRegex);
        const institution = line.match(institutionRegex);

        if (degree || institution || years) {
            return {
                degree: degree ? degree[0] : '',
                field: degree ? degree[3] : '',
                institution: institution ? institution[0] : '',
                year: years ? years[years.length - 1] : '',
                raw: line
            };
        }
        return null;
    }

    extractExperience(lines) {
        const experienceKeywords = ['experience', 'employment', 'work', 'career', 'professional'];
        const jobTitleKeywords = ['developer', 'engineer', 'manager', 'analyst', 'consultant', 'specialist', 'lead', 'senior', 'junior'];
        
        let inExperienceSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            // Check if we're entering experience section
            if (experienceKeywords.some(keyword => line.includes(keyword)) && line.length < 50) {
                inExperienceSection = true;
                continue;
            }

            // Check if we're leaving experience section
            if (inExperienceSection && this.isSectionHeader(line)) {
                inExperienceSection = false;
                continue;
            }

            if (inExperienceSection || jobTitleKeywords.some(keyword => line.includes(keyword))) {
                const experience = this.parseExperienceEntry(lines[i], lines.slice(i, i + 5));
                if (experience) {
                    this.resumeData.sections.experience.push(experience);
                }
            }
        }
    }

    parseExperienceEntry(line, context) {
        const yearRegex = /(\d{4})/g;
        const dateRangeRegex = /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/i;
        const companyRegex = /(at|@)\s+([^,\n]+)/i;

        const years = line.match(yearRegex);
        const dateRange = line.match(dateRangeRegex);
        const company = line.match(companyRegex);

        // Look for job title patterns
        const jobTitleKeywords = ['developer', 'engineer', 'manager', 'analyst', 'consultant', 'specialist', 'lead', 'senior', 'junior'];
        const hasJobTitle = jobTitleKeywords.some(keyword => line.toLowerCase().includes(keyword));

        if (hasJobTitle || years || company) {
            return {
                title: line.trim(),
                company: company ? company[2].trim() : '',
                startYear: dateRange ? dateRange[1] : (years ? years[0] : ''),
                endYear: dateRange ? dateRange[2] : (years && years.length > 1 ? years[1] : ''),
                description: context.slice(1).join(' ').trim(),
                raw: line
            };
        }
        return null;
    }

    extractSkills(lines) {
        const skillsKeywords = ['skills', 'technologies', 'technical', 'programming', 'languages', 'tools'];
        const commonSkills = [
            'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'html', 'css',
            'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'docker', 'kubernetes',
            'git', 'linux', 'windows', 'mac', 'photoshop', 'figma', 'sketch'
        ];

        let inSkillsSection = false;

        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            
            // Check if we're in skills section
            if (skillsKeywords.some(keyword => lowerLine.includes(keyword)) && line.length < 50) {
                inSkillsSection = true;
                continue;
            }

            if (inSkillsSection && this.isSectionHeader(lowerLine)) {
                inSkillsSection = false;
                continue;
            }

            // Extract skills from current line
            const foundSkills = commonSkills.filter(skill => lowerLine.includes(skill));
            if (foundSkills.length > 0 || inSkillsSection) {
                this.resumeData.sections.skills.push(...foundSkills);
                
                // Also add the raw line if it contains multiple skills
                if (inSkillsSection && line.trim()) {
                    this.resumeData.sections.skills.push(line.trim());
                }
            }
        }

        // Remove duplicates
        this.resumeData.sections.skills = [...new Set(this.resumeData.sections.skills)];
    }

    extractProjects(lines) {
        const projectKeywords = ['projects', 'portfolio', 'built', 'developed', 'created'];
        let inProjectsSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            if (projectKeywords.some(keyword => line.includes(keyword)) && line.length < 50) {
                inProjectsSection = true;
                continue;
            }

            if (inProjectsSection && this.isSectionHeader(line)) {
                inProjectsSection = false;
                continue;
            }

            if (inProjectsSection && lines[i].trim()) {
                this.resumeData.sections.projects.push({
                    name: lines[i].trim(),
                    description: lines.slice(i + 1, i + 3).join(' ').trim()
                });
            }
        }
    }

    extractCertifications(lines) {
        const certKeywords = ['certification', 'certificate', 'certified', 'license'];
        
        for (const line of lines) {
            if (certKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                this.resumeData.sections.certifications.push(line.trim());
            }
        }
    }

    isSectionHeader(line) {
        const sectionHeaders = ['experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'summary', 'objective'];
        return sectionHeaders.some(header => line.includes(header)) && line.length < 50;
    }

    // Query methods for RAG
    getEducationInfo() {
        if (this.resumeData.sections.education.length === 0) {
            return "No specific education information found in the resume.";
        }

        return this.resumeData.sections.education.map(edu => {
            return `${edu.degree} ${edu.field ? 'in ' + edu.field : ''} from ${edu.institution} ${edu.year ? '(' + edu.year + ')' : ''}`.trim();
        }).join('; ');
    }

    getCurrentWorkExperience() {
        const currentJob = this.resumeData.sections.experience.find(exp => 
            exp.endYear.toLowerCase().includes('present') || 
            exp.endYear.toLowerCase().includes('current') ||
            exp.endYear === '' ||
            parseInt(exp.endYear) >= new Date().getFullYear() - 1
        );

        if (currentJob) {
            return `Currently working as ${currentJob.title} ${currentJob.company ? 'at ' + currentJob.company : ''} ${currentJob.startYear ? 'since ' + currentJob.startYear : ''}`;
        }

        return "Current employment information not clearly specified in resume.";
    }

    getAllWorkExperience() {
        if (this.resumeData.sections.experience.length === 0) {
            return "No work experience information found in the resume.";
        }

        return this.resumeData.sections.experience.map(exp => {
            const duration = exp.startYear && exp.endYear ? `(${exp.startYear} - ${exp.endYear})` : '';
            return `${exp.title} ${exp.company ? 'at ' + exp.company : ''} ${duration}`;
        }).join('; ');
    }

    getSkillsSummary() {
        if (this.resumeData.sections.skills.length === 0) {
            return "No specific skills information found in the resume.";
        }

        return this.resumeData.sections.skills.slice(0, 10).join(', ');
    }

    getProjectsSummary() {
        if (this.resumeData.sections.projects.length === 0) {
            return "No specific projects information found in the resume.";
        }

        return this.resumeData.sections.projects.map(proj => proj.name).join(', ');
    }

    searchResume(query) {
        const lowerQuery = query.toLowerCase();
        const results = [];

        // Search in raw text
        if (this.resumeData.rawText.toLowerCase().includes(lowerQuery)) {
            const sentences = this.resumeData.rawText.split(/[.!?]+/);
            const relevantSentences = sentences.filter(sentence => 
                sentence.toLowerCase().includes(lowerQuery)
            );
            results.push(...relevantSentences.slice(0, 3));
        }

        return results.join(' ');
    }
}
