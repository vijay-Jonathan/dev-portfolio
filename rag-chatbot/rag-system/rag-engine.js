class RAGEngine {
    constructor() {
        this.resumeParser = null;
        this.resumeData = null;
    }

    initialize(resumeParser) {
        this.resumeParser = resumeParser;
        this.resumeData = resumeParser.resumeData;
    }

    async answerQuestion(question) {
        if (!this.resumeData) {
            return "Please upload your resume first so I can answer questions about your background.";
        }

        const lowerQuestion = question.toLowerCase();
        
        // Education-related questions
        if (this.isEducationQuestion(lowerQuestion)) {
            return this.getEducationAnswer(lowerQuestion);
        }
        
        // Work experience questions
        if (this.isWorkExperienceQuestion(lowerQuestion)) {
            return this.getWorkExperienceAnswer(lowerQuestion);
        }
        
        // Skills questions
        if (this.isSkillsQuestion(lowerQuestion)) {
            return this.getSkillsAnswer(lowerQuestion);
        }
        
        // Projects questions
        if (this.isProjectsQuestion(lowerQuestion)) {
            return this.getProjectsAnswer(lowerQuestion);
        }
        
        // Current job questions
        if (this.isCurrentJobQuestion(lowerQuestion)) {
            return this.getCurrentJobAnswer(lowerQuestion);
        }
        
        // Personal info questions
        if (this.isPersonalInfoQuestion(lowerQuestion)) {
            return this.getPersonalInfoAnswer(lowerQuestion);
        }
        
        // Job description analysis (long text)
        if (question.length > 200) {
            return this.analyzeJobDescription(question);
        }
        
        // General search in resume
        return this.performGeneralSearch(question);
    }

    isEducationQuestion(question) {
        const educationKeywords = [
            'education', 'degree', 'university', 'college', 'school', 'study', 'studied',
            'bachelor', 'master', 'phd', 'graduation', 'graduated', 'academic', 'qualification'
        ];
        return educationKeywords.some(keyword => question.includes(keyword));
    }

    getEducationAnswer(question) {
        const education = this.resumeData.sections.education;
        
        if (education.length === 0) {
            return "I couldn't find specific education information in your resume. You might want to add more details about your educational background.";
        }

        let answer = "Based on your resume, here's your educational background:\n\n";
        
        education.forEach((edu, index) => {
            answer += `${index + 1}. `;
            if (edu.degree) answer += `${edu.degree}`;
            if (edu.field) answer += ` in ${edu.field}`;
            if (edu.institution) answer += ` from ${edu.institution}`;
            if (edu.year) answer += ` (${edu.year})`;
            answer += "\n";
        });

        // Add specific details based on question
        if (question.includes('where') || question.includes('which university') || question.includes('which college')) {
            const institutions = education.map(edu => edu.institution).filter(inst => inst);
            if (institutions.length > 0) {
                answer += `\nYou studied at: ${institutions.join(', ')}`;
            }
        }

        if (question.includes('when') || question.includes('year')) {
            const years = education.map(edu => edu.year).filter(year => year);
            if (years.length > 0) {
                answer += `\nGraduation years: ${years.join(', ')}`;
            }
        }

        return answer;
    }

    isWorkExperienceQuestion(question) {
        const workKeywords = [
            'work', 'job', 'experience', 'employment', 'career', 'position', 'role',
            'worked', 'employed', 'company', 'companies', 'employer', 'professional'
        ];
        return workKeywords.some(keyword => question.includes(keyword));
    }

    getWorkExperienceAnswer(question) {
        const experience = this.resumeData.sections.experience;
        
        if (experience.length === 0) {
            return "I couldn't find specific work experience information in your resume. You might want to add more details about your professional background.";
        }

        let answer = "Here's your work experience based on your resume:\n\n";
        
        experience.forEach((exp, index) => {
            answer += `${index + 1}. `;
            if (exp.title) answer += `${exp.title}`;
            if (exp.company) answer += ` at ${exp.company}`;
            
            if (exp.startYear || exp.endYear) {
                answer += ` (${exp.startYear || '?'} - ${exp.endYear || 'Present'})`;
            }
            
            if (exp.description && exp.description.trim()) {
                answer += `\n   ${exp.description.substring(0, 200)}${exp.description.length > 200 ? '...' : ''}`;
            }
            answer += "\n\n";
        });

        return answer.trim();
    }

    isCurrentJobQuestion(question) {
        const currentKeywords = [
            'current', 'currently', 'now', 'present', 'today', 'working at',
            'current job', 'current position', 'current role', 'current company'
        ];
        return currentKeywords.some(keyword => question.includes(keyword));
    }

    getCurrentJobAnswer(question) {
        const currentJob = this.resumeData.sections.experience.find(exp => 
            exp.endYear.toLowerCase().includes('present') || 
            exp.endYear.toLowerCase().includes('current') ||
            exp.endYear === '' ||
            parseInt(exp.endYear) >= new Date().getFullYear() - 1
        );

        if (!currentJob) {
            // Try to get the most recent job
            const sortedJobs = this.resumeData.sections.experience
                .filter(exp => exp.startYear)
                .sort((a, b) => parseInt(b.startYear) - parseInt(a.startYear));
            
            if (sortedJobs.length > 0) {
                const recentJob = sortedJobs[0];
                return `Based on your resume, your most recent position was ${recentJob.title}${recentJob.company ? ' at ' + recentJob.company : ''}${recentJob.startYear ? ' starting in ' + recentJob.startYear : ''}. ${recentJob.description ? recentJob.description : ''}`;
            }
            
            return "I couldn't find clear information about your current employment in your resume.";
        }

        let answer = `Currently, you are working as ${currentJob.title}`;
        if (currentJob.company) answer += ` at ${currentJob.company}`;
        if (currentJob.startYear) answer += ` since ${currentJob.startYear}`;
        
        if (currentJob.description && currentJob.description.trim()) {
            answer += `.\n\nYour role involves: ${currentJob.description}`;
        }

        return answer;
    }

    isSkillsQuestion(question) {
        const skillsKeywords = [
            'skills', 'skill', 'technology', 'technologies', 'programming', 'languages',
            'tools', 'software', 'technical', 'expertise', 'proficient', 'know'
        ];
        return skillsKeywords.some(keyword => question.includes(keyword));
    }

    getSkillsAnswer(question) {
        const skills = this.resumeData.sections.skills;
        
        if (skills.length === 0) {
            return "I couldn't find a specific skills section in your resume. You might want to add more details about your technical skills and expertise.";
        }

        let answer = "Based on your resume, your skills include:\n\n";
        
        // Group skills by category if possible
        const technicalSkills = skills.filter(skill => 
            ['javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'html', 'css'].some(tech => 
                skill.toLowerCase().includes(tech)
            )
        );
        
        const databaseSkills = skills.filter(skill => 
            ['sql', 'mongodb', 'postgresql', 'mysql', 'database'].some(db => 
                skill.toLowerCase().includes(db)
            )
        );
        
        const cloudSkills = skills.filter(skill => 
            ['aws', 'azure', 'cloud', 'docker', 'kubernetes'].some(cloud => 
                skill.toLowerCase().includes(cloud)
            )
        );

        if (technicalSkills.length > 0) {
            answer += `**Programming & Development:** ${technicalSkills.join(', ')}\n\n`;
        }
        
        if (databaseSkills.length > 0) {
            answer += `**Databases:** ${databaseSkills.join(', ')}\n\n`;
        }
        
        if (cloudSkills.length > 0) {
            answer += `**Cloud & DevOps:** ${cloudSkills.join(', ')}\n\n`;
        }
        
        // Add remaining skills
        const remainingSkills = skills.filter(skill => 
            !technicalSkills.includes(skill) && 
            !databaseSkills.includes(skill) && 
            !cloudSkills.includes(skill)
        );
        
        if (remainingSkills.length > 0) {
            answer += `**Other Skills:** ${remainingSkills.slice(0, 10).join(', ')}`;
        }

        return answer;
    }

    isProjectsQuestion(question) {
        const projectKeywords = [
            'project', 'projects', 'built', 'build', 'developed', 'created', 'made',
            'portfolio', 'work', 'application', 'app', 'website', 'system'
        ];
        return projectKeywords.some(keyword => question.includes(keyword));
    }

    getProjectsAnswer(question) {
        const projects = this.resumeData.sections.projects;
        
        if (projects.length === 0) {
            return "I couldn't find specific project information in your resume. You might want to add more details about projects you've worked on.";
        }

        let answer = "Based on your resume, here are your projects:\n\n";
        
        projects.forEach((project, index) => {
            answer += `${index + 1}. **${project.name}**`;
            if (project.description && project.description.trim()) {
                answer += `\n   ${project.description}`;
            }
            answer += "\n\n";
        });

        return answer.trim();
    }

    isPersonalInfoQuestion(question) {
        const personalKeywords = [
            'name', 'email', 'phone', 'contact', 'linkedin', 'github', 'profile',
            'reach', 'connect', 'who are you', 'about you'
        ];
        return personalKeywords.some(keyword => question.includes(keyword));
    }

    getPersonalInfoAnswer(question) {
        const personal = this.resumeData.sections.personalInfo;
        
        let answer = "Here's your contact information from your resume:\n\n";
        
        if (personal.name) answer += `**Name:** ${personal.name}\n`;
        if (personal.email) answer += `**Email:** ${personal.email}\n`;
        if (personal.phone) answer += `**Phone:** ${personal.phone}\n`;
        if (personal.linkedin) answer += `**LinkedIn:** ${personal.linkedin}\n`;
        if (personal.github) answer += `**GitHub:** ${personal.github}\n`;

        if (Object.keys(personal).length === 0) {
            return "I couldn't extract specific contact information from your resume. Make sure your name, email, and other contact details are clearly visible.";
        }

        return answer;
    }

    performGeneralSearch(question) {
        // Search for relevant content in the resume
        const searchResults = this.resumeParser.searchResume(question);
        
        if (searchResults && searchResults.trim()) {
            return `Based on your resume, here's what I found related to your question:\n\n${searchResults}`;
        }

        // If no specific match, provide a general response with resume summary
        let summary = "I couldn't find specific information about that in your resume. Here's a summary of what I know about you:\n\n";
        
        if (this.resumeData.sections.personalInfo.name) {
            summary += `You are ${this.resumeData.sections.personalInfo.name}. `;
        }
        
        if (this.resumeData.sections.experience.length > 0) {
            const recentJob = this.resumeData.sections.experience[0];
            summary += `You work as ${recentJob.title}${recentJob.company ? ' at ' + recentJob.company : ''}. `;
        }
        
        if (this.resumeData.sections.education.length > 0) {
            const education = this.resumeData.sections.education[0];
            summary += `You have ${education.degree}${education.field ? ' in ' + education.field : ''}. `;
        }
        
        summary += "\n\nCould you please rephrase your question or ask about something more specific like your education, work experience, or skills?";
        
        return summary;
    }

    analyzeJobDescription(jobDescription) {
        if (!this.resumeData) {
            return "Please upload your resume first so I can analyze how you fit this job.";
        }

        const jobLower = jobDescription.toLowerCase();
        const yourSkills = this.resumeData.sections.skills.map(s => s.toLowerCase());
        const yourExperience = this.resumeData.sections.experience;
        
        // Find matching skills
        const matchingSkills = yourSkills.filter(skill => 
            jobLower.includes(skill) || skill.split(' ').some(word => jobLower.includes(word))
        );
        
        // Analyze experience relevance
        const relevantExperience = yourExperience.filter(exp => 
            jobLower.includes(exp.title.toLowerCase()) || 
            (exp.company && jobLower.includes(exp.company.toLowerCase())) ||
            (exp.description && exp.description.toLowerCase().split(' ').some(word => jobLower.includes(word)))
        );

        let analysis = `## Job Fit Analysis\n\n`;
        
        analysis += `**Your Matching Skills:**\n`;
        if (matchingSkills.length > 0) {
            analysis += `✅ ${matchingSkills.join(', ')}\n\n`;
        } else {
            analysis += `⚠️ No direct skill matches found, but you may have transferable skills.\n\n`;
        }
        
        analysis += `**Relevant Experience:**\n`;
        if (relevantExperience.length > 0) {
            relevantExperience.forEach(exp => {
                analysis += `✅ ${exp.title}${exp.company ? ' at ' + exp.company : ''}\n`;
            });
        } else {
            analysis += `⚠️ No directly matching experience, but your background may still be relevant.\n`;
        }
        
        analysis += `\n**Why You're a Strong Candidate:**\n`;
        analysis += `• ${this.resumeData.sections.experience.length} professional roles showing career progression\n`;
        analysis += `• ${this.resumeData.sections.skills.length} technical skills demonstrating versatility\n`;
        if (this.resumeData.sections.education.length > 0) {
            analysis += `• Strong educational foundation with ${this.resumeData.sections.education[0].degree}\n`;
        }
        
        return analysis;
    }
}
