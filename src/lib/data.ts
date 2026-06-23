export const personalInfo = {
  name: "Devendra",
  lastName: "Devarakonda",
  fullName: "Devendra Devarakonda",
  title: "Full Stack Developer",
  subtitle: "AI Engineer",
  description:
    "Building scalable software, AI-powered products, and immersive digital experiences. Passionate about transforming ideas into reality through elegant code and innovative solutions.",
  email: "devendra@example.com",
  location: "India",
  resumeUrl: "#",
};

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Blogs", href: "#blogs" },
  { name: "Contact", href: "#contact" },
];

export const skills = [
  { name: "Python", percentage: 95, icon: "python" },
  { name: "React", percentage: 92, icon: "react" },
  { name: "Node.js", percentage: 90, icon: "nodejs" },
  { name: "MongoDB", percentage: 88, icon: "mongodb" },
  { name: "AWS", percentage: 85, icon: "aws" },
  { name: "TypeScript", percentage: 90, icon: "typescript" },
  { name: "Leadership", percentage: 90, icon: "leadership" },
  { name: "System Design", percentage: 85, icon: "system" },
];

export const projects = [
  {
    id: 1,
    title: "CodeMate",
    description:
      "Real-time collaborative coding platform with live editing, WebSocket sync, and integrated terminal. Built for seamless pair programming.",
    image: "/images/project-codemate.png",
    tags: ["React", "Node.js", "WebSocket", "Monaco"],
    category: "fullstack",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 2,
    title: "SkillSage",
    description:
      "AI-powered career recommendation platform that analyzes skills and suggests personalized learning paths using machine learning.",
    image: "/images/project-skillsage.png",
    tags: ["Python", "FastAPI", "OpenAI", "React"],
    category: "ai",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 3,
    title: "Sahaaya",
    description:
      "Community help platform connecting volunteers with those in need. Features real-time chat, location-based matching, and impact tracking.",
    image: "/images/project-sahaaya.png",
    tags: ["Next.js", "MongoDB", "Express", "Socket.io"],
    category: "fullstack",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 4,
    title: "SmartR",
    description:
      "AI productivity analytics platform providing intelligent insights, time tracking heatmaps, and personalized workflow optimization.",
    image: "/images/project-smartr.png",
    tags: ["React", "TensorFlow.js", "D3.js", "Node.js"],
    category: "ai",
    liveUrl: "#",
    codeUrl: "#",
  },
];

export const education = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering",
    university: "Rajiv Gandhi University of Knowledge Technologies",
    period: "2021 — 2025",
    cgpa: "8.5",
    description:
      "Focused on Data Structures, Algorithms, Machine Learning, and Full Stack Development. Active participant in hackathons and coding competitions.",
  },
];

export const blogs = [
  {
    id: 1,
    title: "Why React is Still King in 2025",
    category: "Frontend",
    excerpt:
      "React continues to dominate the frontend landscape. Here's why it remains the top choice for building modern web applications and what makes it stand apart.",
    image: "/images/blog-react.png",
    url: "#",
  },
  {
    id: 2,
    title: "React Error Boundaries Deep Dive",
    category: "React",
    excerpt:
      "Understanding error boundaries is crucial for building resilient React apps. Learn how to implement them effectively and handle edge cases.",
    image: "/images/blog-error.png",
    url: "#",
  },
  {
    id: 3,
    title: "Building Scalable MERN Apps",
    category: "Full Stack",
    excerpt:
      "A comprehensive guide to architecting MERN stack applications that scale. From database design to deployment strategies and beyond.",
    image: "/images/blog-mern.png",
    url: "#",
  },
];

export const socialLinks = [
  { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
  { name: "GitHub", url: "https://github.com", icon: "github" },
  { name: "Twitter", url: "https://x.com", icon: "twitter" },
  { name: "Instagram", url: "https://instagram.com", icon: "instagram" },
  { name: "Medium", url: "https://medium.com", icon: "medium" },
];

export const terminalCommands = [
  { command: "devendra --version", output: "v2.0.25 — Full Stack Developer & AI Engineer" },
  { command: "devendra --skills", output: "Python • React • Node.js • TypeScript • AWS • MongoDB • TensorFlow • Docker" },
  { command: "devendra --projects --count", output: "4 featured projects | 15+ total repositories" },
  { command: "devendra --status", output: "🟢 Available for opportunities | Open to collaboration" },
];
