// ---------- Skill logos (image files) ----------
import htmlLogo from "./assets/tech_logo/html.png";
import cssLogo from "./assets/tech_logo/css.png";
import javascriptLogo from "./assets/tech_logo/javascript.png";
import typescriptLogo from "./assets/tech_logo/typescript.png";
import reactjsLogo from "./assets/tech_logo/reactjs.png";
import nextjsLogo from "./assets/tech_logo/nextjs.png";
import tailwindcssLogo from "./assets/tech_logo/tailwindcss.png";
import javaLogo from "./assets/tech_logo/java.png";
import springbootLogo from "./assets/tech_logo/springboot.png";
import nodejsLogo from "./assets/tech_logo/nodejs.png";
import expressLogo from "./assets/tech_logo/express.png";
import mysqlLogo from "./assets/tech_logo/mysql.png";
import postgreLogo from "./assets/tech_logo/postgre.png";
import mongodbLogo from "./assets/tech_logo/mongodb.png";
import cLogo from "./assets/tech_logo/c.png";
import cppLogo from "./assets/tech_logo/cpp.png";
import pythonLogo from "./assets/tech_logo/python.png";
import gitLogo from "./assets/tech_logo/git.png";
import githubLogo from "./assets/tech_logo/github.png";
import vscodeLogo from "./assets/tech_logo/vscode.png";
import mcLogo from "./assets/tech_logo/mc.png";
import vercelLogo from "./assets/tech_logo/vercel.png";
import powerbiLogo from "./assets/tech_logo/powerbi.png";

// ---------- Skill icons (no PNG available -> use react-icons) ----------
import { SiApachekafka, SiSpring, SiDocker } from "react-icons/si";
import { FaDatabase, FaCloud, FaPlug, FaProjectDiagram } from "react-icons/fa";

// ---------- Education logos ----------
import bvcoepLogo from "./assets/education_logo/bvcoep.png";
import centralacademyLogo from "./assets/education_logo/centralacademy.png";
import springerLogo from "./assets/education_logo/springer.png";

// `light: true` = the logo is dark, so it gets a light tile to stay visible on the dark theme.
export const SkillsInfo = [
  {
    title: "Languages",
    skills: [
      { name: "Java", logo: javaLogo },
      { name: "Python", logo: pythonLogo },
      { name: "JavaScript", logo: javascriptLogo },
      { name: "TypeScript", logo: typescriptLogo },
     
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Spring Boot", logo: springbootLogo },
      { name: "Spring AI", icon: SiSpring },
      { name: "REST APIs", icon: FaPlug },
      { name: "Kafka", icon: SiApachekafka },
      { name: "Node.js", logo: nodejsLogo },
      { name: "Express", logo: expressLogo },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "HTML", logo: htmlLogo },
      { name: "CSS", logo: cssLogo },
      { name: "React JS", logo: reactjsLogo },
      { name: "Next.js", logo: nextjsLogo },
      { name: "Tailwind CSS", logo: tailwindcssLogo },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MySQL", logo: mysqlLogo, light: true },
      { name: "PostgreSQL", logo: postgreLogo },
      { name: "MongoDB", logo: mongodbLogo },
      { name: "pgvector", icon: FaDatabase },
    ],
  },
  {
    title: "Cloud & Tools",
    skills: [
      { name: "Airtel Public Cloud", icon: FaCloud },
      { name: "Docker", icon: SiDocker },
      { name: "Git", logo: gitLogo },
      { name: "GitHub", logo: githubLogo, light: true },
      // { name: "IntelliJ IDEA", icon: SiIntellijidea },
      { name: "VS Code", logo: vscodeLogo },
      { name: "Compass", logo: mcLogo, light: true },
      { name: "Vercel", logo: vercelLogo, light: true },
    ],
  },
  {
    title: "Loading...",
    skills: [
      
      { name: "Microservices", icon: FaProjectDiagram },
    ],
  },
];

// ---------- Experience ----------
export const experience = [
  {
    id: 0,
    role: "Cloud Engineering Intern",
    company: "Xtelify Ltd (Airtel group)",
    date: "Jan 2026 – Jul 2026",
    points: [
      "Worked on Airtel Public Cloud across compute, storage, networking and database management.",
      "Part of NOC operations: monitoring and troubleshooting cloud infrastructure.",
      "Airtel Cloud Engineer certified.",
    ],
    tags: ["Cloud", "Networking", "Databases", "NOC"],
  },
  {
    id: 1,
    role: "Frontend Engineer Intern",
    company: "Quore B2B Marketing",
    date: "Internship",
    points: ["Frontend engineering internship focused on building responsive web interfaces."],
    tags: ["Frontend", "React", "Tailwind CSS"],
  },
];

// ---------- Education ----------
export const education = [
  {
    id: 0,
    img: bvcoepLogo,
    school: "Bharati Vidyapeeth College of Engineering, Pune",
    date: "July 2022 – July 2026",
    grade: "8.54 CGPA",
    desc: "I completed my Bachelor of Technology degree in Information Technology (B.Tech.) from Bharati Vidyapeeth College of Engineering, Pune. Throughout my studies, I was immersed in a variety of subjects that deepened my understanding of computing and technology. My time at BVPCOE allowed me to work on projects that applied theoretical concepts to real-world problems.",
    degree: "Bachelor of Technology - BTech (Information Technology)",
  },
  {
    id: 1,
    img: springerLogo,
    school: "Springer Public School, Prayagraj",
    date: "Apr 2020 – July 2021",
    grade: "79%",
    desc: "I completed my class 12 education from Springer Public School, under the CBSE board, where I studied Physics, Chemistry, and Mathematics (PCM) with Hindi.",
    degree: "CBSE(XII) - PCM ",
  },
  {
    id: 2,
    img: centralacademyLogo,
    school: "Central Academy, Prayagraj",
    date: "Apr 2018 – March 2019",
    grade: "89.8%",
    desc: "I completed my class 10 education from Central Academy, under the CBSE board.",
    degree: "CBSE(X)",
  },
];

// ---------- Projects ----------
// image: null  -> a neon placeholder card is shown instead.
// github / webapp: "" or "#" -> that button is hidden.
// TODO: paste your real GitHub links below.
export const projects = [
  {
    id: 0,
    title: "CodeConverse",
    description:
      "Sign in with GitHub, index a repository and talk to your code. A Spring Boot + Spring AI backend with pgvector for embeddings, and a Next.js (TypeScript) frontend.",
    image: null,
    tags: ["Java", "Spring Boot", "Spring AI", "pgvector", "Next.js", "TypeScript"],
    github: "",
    webapp: "",
  },
  {
    id: 1,
    title: "Real-Time Fraud Detection",
    description:
      "A real-time fraud detection system built with Java and Spring Boot. Transactions flow through Kafka into a Spring Boot service backed by PostgreSQL, with a React frontend.",
    image: null,
    tags: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "React JS"],
    github: "",
    webapp: "",
  },
  // Uncomment and edit if you want a third project (add a real link first):
  {
    id: 2,
    title: "Automated Meeting Reporter",
    description: "Describe what it does in one or two sentences.",
    image: null,
    tags: ["Python", "Grok","Whisper", "LLM API"],
    github: "",
    webapp: "",
  },
];

// ---------- Profile (used by the city / room experience) ----------
export const profile = {
  name: "Shreshtha Srivastava",
  roles: ["Full Stack Developer", "Java & Spring Boot Developer", "Cloud & AI Enthusiast"],
  bio: "Information Technology graduate (B.Tech, 2026) building full-stack applications with Java, Spring Boot and React, plus AI integrations with Spring AI and pgvector. Cloud engineering intern on Airtel Public Cloud, with a background in Python and machine learning. I like turning real problems into reliable, working software.",
  resume: "https://drive.google.com/file/d/16taW0JrFDVVUSReBh0WQU45PL2ijvPX1/view?usp=sharing",
  github: "https://github.com/Shreshtha9",
  linkedin: "https://www.linkedin.com/in/shreshtha-srivastava-229927259",
};
