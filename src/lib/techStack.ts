export interface Technology {
  name: string;
  iconName: string; // e.g. "React", "Nodejs", "Python"
  experience: 'Advanced' | 'Intermediate' | 'Beginner';
  projectCount: number;
  description: string;
  projects: string[];
}

export interface TechCategory {
  id: string;
  name: string;
  color: string;
  technologies: Technology[];
}

export const techStackData: TechCategory[] = [
  {
    id: "frontend",
    name: "Frontend",
    color: "#3b82f6", // Blue
    technologies: [
      {
        name: "React",
        iconName: "React",
        experience: "Advanced",
        projectCount: 3,
        description: "Declarative, efficient, and flexible JavaScript library for building user interfaces.",
        projects: ["CodeMate", "SkillSage", "Sahaaya"]
      },
      {
        name: "Next.js",
        iconName: "Nextjs",
        experience: "Advanced",
        projectCount: 2,
        description: "React framework for production-grade applications with SSR and static generation.",
        projects: ["CodeMate", "Personal Portfolio"]
      },
      {
        name: "TypeScript",
        iconName: "Typescript",
        experience: "Advanced",
        projectCount: 4,
        description: "Typed superset of JavaScript that compiles to plain JavaScript.",
        projects: ["CodeMate", "SkillSage", "Sahaaya", "SmartR"]
      },
      {
        name: "Tailwind CSS",
        iconName: "Tailwind",
        experience: "Advanced",
        projectCount: 2,
        description: "Utility-first CSS framework for rapid and highly customizable UI design.",
        projects: ["CodeMate", "Personal Portfolio"]
      },
      {
        name: "Framer Motion",
        iconName: "Framer",
        experience: "Advanced",
        projectCount: 2,
        description: "Production-ready motion library for React that simplifies complex UI animations.",
        projects: ["Personal Portfolio", "Constellation Demo"]
      },
      {
        name: "JavaScript",
        iconName: "Javascript",
        experience: "Advanced",
        projectCount: 5,
        description: "High-level, dynamic, and interpreted programming language for client-side scripting.",
        projects: ["CodeMate", "SkillSage", "Sahaaya", "SmartR", "Scripts"]
      },
      {
        name: "HTML5",
        iconName: "Html5",
        experience: "Advanced",
        projectCount: 5,
        description: "The standard markup language for documents designed to be displayed in a web browser.",
        projects: ["CodeMate", "SkillSage", "Sahaaya", "SmartR", "Personal Portfolio"]
      },
      {
        name: "CSS3",
        iconName: "Css3",
        experience: "Advanced",
        projectCount: 5,
        description: "Style sheet language used for describing the presentation of a document written in HTML.",
        projects: ["CodeMate", "SkillSage", "Sahaaya", "SmartR", "Personal Portfolio"]
      },
      {
        name: "Redux",
        iconName: "Redux",
        experience: "Intermediate",
        projectCount: 1,
        description: "Predictable state container for JavaScript apps to write consistent applications.",
        projects: ["CodeMate"]
      },
      {
        name: "React Query",
        iconName: "ReactQuery",
        experience: "Advanced",
        projectCount: 2,
        description: "Powerful data synchronization and state management for fetching API data in React.",
        projects: ["CodeMate", "SkillSage"]
      },
      {
        name: "Vite",
        iconName: "Vite",
        experience: "Advanced",
        projectCount: 4,
        description: "Next-generation frontend tooling that is fast, lean, and highly optimized.",
        projects: ["CodeMate", "SkillSage", "Sahaaya", "Constellation Demo"]
      },
      {
        name: "GSAP",
        iconName: "Gsap",
        experience: "Intermediate",
        projectCount: 1,
        description: "Ultra-high-performance HTML5 animation library that animates everything Javascript can touch.",
        projects: ["Interactive Canvas Project"]
      },
      {
        name: "React Router",
        iconName: "ReactRouter",
        experience: "Advanced",
        projectCount: 3,
        description: "Lightweight, fully-featured routing library for React applications.",
        projects: ["CodeMate", "SkillSage", "Sahaaya"]
      },
      {
        name: "React Hook Form",
        iconName: "HookForm",
        experience: "Advanced",
        projectCount: 2,
        description: "Performant, flexible and extensible forms with easy-to-use validation.",
        projects: ["CodeMate", "Sahaaya"]
      }
    ]
  },
  {
    id: "backend",
    name: "Backend",
    color: "#10b981", // Green
    technologies: [
      {
        name: "Node.js",
        iconName: "Nodejs",
        experience: "Advanced",
        projectCount: 2,
        description: "JavaScript runtime built on Chrome's V8 engine to build scalable network applications.",
        projects: ["CodeMate", "SmartR"]
      },
      {
        name: "Express.js",
        iconName: "Express",
        experience: "Advanced",
        projectCount: 2,
        description: "Minimal and flexible Node.js web application framework providing robust API tools.",
        projects: ["CodeMate", "SmartR"]
      },
      {
        name: "FastAPI",
        iconName: "Fastapi",
        experience: "Advanced",
        projectCount: 1,
        description: "High-performance, easy-to-learn web framework for building APIs with Python 3.8+.",
        projects: ["SmartR"]
      },
      {
        name: "JWT",
        iconName: "Jwt",
        experience: "Advanced",
        projectCount: 2,
        description: "JSON Web Tokens for secure authentication and lightweight authorization flows.",
        projects: ["CodeMate", "SmartR"]
      },
      {
        name: "Socket.IO",
        iconName: "Socketio",
        experience: "Advanced",
        projectCount: 1,
        description: "Bidirectional and event-based communication library for real-time applications.",
        projects: ["CodeMate"]
      },
      {
        name: "EJS",
        iconName: "Ejs",
        experience: "Intermediate",
        projectCount: 1,
        description: "Simple templating language that lets you generate HTML markup with plain JavaScript.",
        projects: ["Admin Dashboard Template"]
      },
      {
        name: "Nodemon",
        iconName: "Nodemon",
        experience: "Advanced",
        projectCount: 3,
        description: "Tool that helps develop Node.js based applications by automatically restarting on file changes.",
        projects: ["CodeMate", "SmartR", "Dev Server"]
      }
    ]
  },
  {
    id: "databases",
    name: "Databases",
    color: "#f97316", // Orange
    technologies: [
      {
        name: "MongoDB",
        iconName: "Mongodb",
        experience: "Advanced",
        projectCount: 2,
        description: "Document database with the scalability and flexibility that you want.",
        projects: ["CodeMate", "SkillSage"]
      },
      {
        name: "PostgreSQL",
        iconName: "Postgres",
        experience: "Advanced",
        projectCount: 1,
        description: "Powerful, open-source object-relational database system with strong reliability.",
        projects: ["SmartR"]
      },
      {
        name: "MySQL",
        iconName: "Mysql",
        experience: "Intermediate",
        projectCount: 1,
        description: "Relational database management system based on SQL (Structured Query Language).",
        projects: ["Data Analytics Project"]
      },
      {
        name: "Redis",
        iconName: "Redis",
        experience: "Advanced",
        projectCount: 1,
        description: "In-memory data structure store used as a database, cache, and message broker.",
        projects: ["SmartR"]
      },
      {
        name: "DynamoDB",
        iconName: "Dynamodb",
        experience: "Intermediate",
        projectCount: 1,
        description: "Fully managed, serverless, key-value NoSQL database designed for high performance.",
        projects: ["AWS Deployments"]
      },
      {
        name: "Prisma",
        iconName: "Prisma",
        experience: "Advanced",
        projectCount: 1,
        description: "Next-generation Node.js and TypeScript ORM to build faster databases.",
        projects: ["SmartR"]
      }
    ]
  },
  {
    id: "cloud",
    name: "Cloud & Deployment",
    color: "#06b6d4", // Cyan
    technologies: [
      {
        name: "AWS",
        iconName: "Aws",
        experience: "Intermediate",
        projectCount: 1,
        description: "On-demand cloud computing platforms and APIs on a metered pay-as-you-go basis.",
        projects: ["SmartR"]
      },
      {
        name: "Google Cloud",
        iconName: "Gcp",
        experience: "Intermediate",
        projectCount: 1,
        description: "Suite of cloud computing services that runs on the same infrastructure as Google products.",
        projects: ["SkillSage"]
      },
      {
        name: "Cloudflare",
        iconName: "Cloudflare",
        experience: "Advanced",
        projectCount: 2,
        description: "Global network offering DNS, CDN, security, and edge computing worker instances.",
        projects: ["Personal Portfolio", "SmartR API CDN"]
      },
      {
        name: "Firebase",
        iconName: "Firebase",
        experience: "Advanced",
        projectCount: 1,
        description: "Google's mobile and web application development platform offering auth and real-time DB.",
        projects: ["Chat App Demo"]
      },
      {
        name: "Supabase",
        iconName: "Supabase",
        experience: "Advanced",
        projectCount: 1,
        description: "An open source alternative to Firebase built on top of enterprise-grade PostgreSQL.",
        projects: ["Sahaaya"]
      },
      {
        name: "Appwrite",
        iconName: "Appwrite",
        experience: "Advanced",
        projectCount: 1,
        description: "Self-hosted secure end-to-end backend server for Web, Mobile & Flutter developers.",
        projects: ["Sahaaya"]
      },
      {
        name: "Netlify",
        iconName: "Netlify",
        experience: "Advanced",
        projectCount: 3,
        description: "Cloud computing company that offers hosting and serverless backend services for static sites.",
        projects: ["Sahaaya", "Vite Demos", "Portfolios"]
      },
      {
        name: "Vercel",
        iconName: "Vercel",
        experience: "Advanced",
        projectCount: 3,
        description: "Platform for frontend frameworks and static sites, built by creators of Next.js.",
        projects: ["CodeMate", "Personal Portfolio", "SkillSage"]
      },
      {
        name: "Render",
        iconName: "Render",
        experience: "Advanced",
        projectCount: 2,
        description: "Unified cloud platform to build and run all web apps and APIs with free SSL.",
        projects: ["CodeMate Server", "SmartR API Backend"]
      },
      {
        name: "Nginx",
        iconName: "Nginx",
        experience: "Intermediate",
        projectCount: 1,
        description: "High-performance web server, reverse proxy, load balancer, and HTTP cache server.",
        projects: ["Docker VPS Deployments"]
      }
    ]
  },
  {
    id: "devops",
    name: "DevOps",
    color: "#f43f5e", // Rose
    technologies: [
      {
        name: "Docker",
        iconName: "Docker",
        experience: "Advanced",
        projectCount: 2,
        description: "Set of platform-as-a-service products that use OS-level virtualization to deliver packages.",
        projects: ["SmartR", "CodeMate Server"]
      },
      {
        name: "Kubernetes",
        iconName: "Kubernetes",
        experience: "Intermediate",
        projectCount: 1,
        description: "Open-source container orchestration system for automating application deployment and scaling.",
        projects: ["Scale Testing"]
      },
      {
        name: "Terraform",
        iconName: "Terraform",
        experience: "Intermediate",
        projectCount: 1,
        description: "Infrastructure-as-code software tool that allows defining cloud infrastructure using declarative config.",
        projects: ["AWS Cluster provisioning"]
      },
      {
        name: "Grafana",
        iconName: "Grafana",
        experience: "Intermediate",
        projectCount: 1,
        description: "Multi-platform open-source analytics and interactive visualization web application.",
        projects: ["SmartR Telemetry"]
      }
    ]
  },
  {
    id: "ai",
    name: "AI / Data Science",
    color: "#8b5cf6", // Purple
    technologies: [
      {
        name: "Python",
        iconName: "Python",
        experience: "Advanced",
        projectCount: 2,
        description: "High-level programming language ideal for scripting, automation, and machine learning models.",
        projects: ["SkillSage", "SmartR"]
      },
      {
        name: "NumPy",
        iconName: "Numpy",
        experience: "Advanced",
        projectCount: 1,
        description: "Fundamental package for scientific computing with Python containing powerful array objects.",
        projects: ["SkillSage"]
      },
      {
        name: "Pandas",
        iconName: "Pandas",
        experience: "Advanced",
        projectCount: 1,
        description: "Python package providing fast, flexible, and expressive data structures designed for relational data.",
        projects: ["SkillSage"]
      },
      {
        name: "Matplotlib",
        iconName: "Matplotlib",
        experience: "Intermediate",
        projectCount: 1,
        description: "Comprehensive library for creating static, animated, and interactive visualizations in Python.",
        projects: ["SkillSage Analytics"]
      },
      {
        name: "Scikit-Learn",
        iconName: "ScikitLearn",
        experience: "Advanced",
        projectCount: 1,
        description: "Simple and efficient tools for predictive data analysis and classical machine learning models.",
        projects: ["SkillSage"]
      },
      {
        name: "TensorFlow",
        iconName: "Tensorflow",
        experience: "Intermediate",
        projectCount: 1,
        description: "End-to-end open source platform for machine learning, deep neural networks, and model graph execution.",
        projects: ["SkillSage Classifier"]
      }
    ]
  },
  {
    id: "tools",
    name: "Tools",
    color: "#eab308", // Yellow
    technologies: [
      {
        name: "Git",
        iconName: "Git",
        experience: "Advanced",
        projectCount: 5,
        description: "Distributed version control system designed to handle everything from small to very large projects.",
        projects: ["CodeMate", "SkillSage", "Sahaaya", "SmartR", "Portfolios"]
      },
      {
        name: "GitHub",
        iconName: "Github",
        experience: "Advanced",
        projectCount: 5,
        description: "Provider of Internet hosting for software development and version control using Git.",
        projects: ["CodeMate", "SkillSage", "Sahaaya", "SmartR", "Portfolios"]
      },
      {
        name: "Postman",
        iconName: "Postman",
        experience: "Advanced",
        projectCount: 2,
        description: "API platform for building and using APIs, streamlining testing and mock servers.",
        projects: ["SmartR API Testing", "CodeMate Server API"]
      },
      {
        name: "Figma",
        iconName: "Figma",
        experience: "Intermediate",
        projectCount: 2,
        description: "Collaborative web application for interface design, vector graphics editor and prototyping tool.",
        projects: ["CodeMate UI Mockups", "Portfolio Layout Design"]
      },
      {
        name: "Notion",
        iconName: "Notion",
        experience: "Advanced",
        projectCount: 4,
        description: "Project management, database-driven wiki, note-taking, and documentation workspace.",
        projects: ["Project Specifications", "Team Notes", "Personal Wiki"]
      },
      {
        name: "Windows Terminal",
        iconName: "Terminal",
        experience: "Advanced",
        projectCount: 5,
        description: "Modern host application for command-line shells like PowerShell, CMD, and WSL.",
        projects: ["Developer Workstation Setup", "Build Automation Scripts"]
      }
    ]
  }
];
