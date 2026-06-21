import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Technology } from '@/lib/techStack';
import { 
  FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaAws, FaDocker, FaGitAlt, FaGithub, FaFigma, FaTerminal, FaCode, FaDatabase 
} from 'react-icons/fa';
import { 
  SiTypescript, SiNextdotjs, SiTailwindcss, SiFramer, SiRedux, SiReactquery, SiVite, SiGsap, SiReactrouter, 
  SiReacthookform, SiExpress, SiFastapi, SiJsonwebtokens, SiSocketdotio, SiMongodb, SiPostgresql, SiMysql, 
  SiRedis, SiPrisma, SiGooglecloud, SiCloudflare, SiFirebase, SiSupabase, SiAppwrite, 
  SiNetlify, SiVercel, SiRender, SiNginx, SiKubernetes, SiTerraform, SiGrafana, SiNumpy, SiPandas, 
  SiScikitlearn, SiTensorflow, SiPostman, SiNotion 
} from 'react-icons/si';
import { IoLogoJavascript } from 'react-icons/io';

// Helper to resolve icon by string name
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const iconProps = { className: className || "w-5 h-5 text-[#f3f4f6]" };
  switch (name) {
    case 'React': return <FaReact {...iconProps} className={`${iconProps.className} text-[#61dafb]`} />;
    case 'Nodejs': return <FaNodeJs {...iconProps} className={`${iconProps.className} text-[#339933]`} />;
    case 'Python': return <FaPython {...iconProps} className={`${iconProps.className} text-[#3776ab]`} />;
    case 'Html5': return <FaHtml5 {...iconProps} className={`${iconProps.className} text-[#e34f26]`} />;
    case 'Css3': return <FaCss3Alt {...iconProps} className={`${iconProps.className} text-[#1572b6]`} />;
    case 'Aws': return <FaAws {...iconProps} className={`${iconProps.className} text-[#ff9900]`} />;
    case 'Docker': return <FaDocker {...iconProps} className={`${iconProps.className} text-[#2496ed]`} />;
    case 'Git': return <FaGitAlt {...iconProps} className={`${iconProps.className} text-[#f05032]`} />;
    case 'Github': return <FaGithub {...iconProps} className={`${iconProps.className} text-[#ffffff]`} />;
    case 'Figma': return <FaFigma {...iconProps} className={`${iconProps.className} text-[#f24e1e]`} />;
    case 'Terminal': return <FaTerminal {...iconProps} className={`${iconProps.className} text-[#4d4d4d]`} />;
    case 'Typescript': return <SiTypescript {...iconProps} className={`${iconProps.className} text-[#3178c6]`} />;
    case 'Nextjs': return <SiNextdotjs {...iconProps} className={`${iconProps.className} text-[#ffffff]`} />;
    case 'Tailwind': return <SiTailwindcss {...iconProps} className={`${iconProps.className} text-[#06b6d4]`} />;
    case 'Framer': return <SiFramer {...iconProps} className={`${iconProps.className} text-[#0055ff]`} />;
    case 'Redux': return <SiRedux {...iconProps} className={`${iconProps.className} text-[#764abc]`} />;
    case 'ReactQuery': return <SiReactquery {...iconProps} className={`${iconProps.className} text-[#ff4154]`} />;
    case 'Vite': return <SiVite {...iconProps} className={`${iconProps.className} text-[#646cff]`} />;
    case 'Gsap': return <SiGsap {...iconProps} className={`${iconProps.className} text-[#88ce02]`} />;
    case 'ReactRouter': return <SiReactrouter {...iconProps} className={`${iconProps.className} text-[#ca4245]`} />;
    case 'HookForm': return <SiReacthookform {...iconProps} className={`${iconProps.className} text-[#ec5990]`} />;
    case 'Express': return <SiExpress {...iconProps} className={`${iconProps.className} text-[#ffffff]`} />;
    case 'Fastapi': return <SiFastapi {...iconProps} className={`${iconProps.className} text-[#009688]`} />;
    case 'Jwt': return <SiJsonwebtokens {...iconProps} className={`${iconProps.className} text-[#ffffff]`} />;
    case 'Socketio': return <SiSocketdotio {...iconProps} className={`${iconProps.className} text-[#ffffff]`} />;
    case 'Mongodb': return <SiMongodb {...iconProps} className={`${iconProps.className} text-[#47a248]`} />;
    case 'Postgres': return <SiPostgresql {...iconProps} className={`${iconProps.className} text-[#4169e1]`} />;
    case 'Mysql': return <SiMysql {...iconProps} className={`${iconProps.className} text-[#00758f]`} />;
    case 'Redis': return <SiRedis {...iconProps} className={`${iconProps.className} text-[#d82c20]`} />;
    case 'Dynamodb': return <FaDatabase {...iconProps} className={`${iconProps.className} text-[#4053d6]`} />;
    case 'Prisma': return <SiPrisma {...iconProps} className={`${iconProps.className} text-[#2d3748]`} />;
    case 'Gcp': return <SiGooglecloud {...iconProps} className={`${iconProps.className} text-[#4285f4]`} />;
    case 'Cloudflare': return <SiCloudflare {...iconProps} className={`${iconProps.className} text-[#f38020]`} />;
    case 'Firebase': return <SiFirebase {...iconProps} className={`${iconProps.className} text-[#ffca28]`} />;
    case 'Supabase': return <SiSupabase {...iconProps} className={`${iconProps.className} text-[#3ecf8e]`} />;
    case 'Appwrite': return <SiAppwrite {...iconProps} className={`${iconProps.className} text-[#fd366e]`} />;
    case 'Netlify': return <SiNetlify {...iconProps} className={`${iconProps.className} text-[#00ad9f]`} />;
    case 'Vercel': return <SiVercel {...iconProps} className={`${iconProps.className} text-[#ffffff]`} />;
    case 'Render': return <SiRender {...iconProps} className={`${iconProps.className} text-[#46e3b7]`} />;
    case 'Nginx': return <SiNginx {...iconProps} className={`${iconProps.className} text-[#009639]`} />;
    case 'Kubernetes': return <SiKubernetes {...iconProps} className={`${iconProps.className} text-[#326ce5]`} />;
    case 'Terraform': return <SiTerraform {...iconProps} className={`${iconProps.className} text-[#7b42bc]`} />;
    case 'Grafana': return <SiGrafana {...iconProps} className={`${iconProps.className} text-[#f47a20]`} />;
    case 'Numpy': return <SiNumpy {...iconProps} className={`${iconProps.className} text-[#013243]`} />;
    case 'Pandas': return <SiPandas {...iconProps} className={`${iconProps.className} text-[#150458]`} />;
    case 'ScikitLearn': return <SiScikitlearn {...iconProps} className={`${iconProps.className} text-[#f7931e]`} />;
    case 'Tensorflow': return <SiTensorflow {...iconProps} className={`${iconProps.className} text-[#ff6f00]`} />;
    case 'Postman': return <SiPostman {...iconProps} className={`${iconProps.className} text-[#ff6c37]`} />;
    case 'Notion': return <SiNotion {...iconProps} className={`${iconProps.className} text-[#ffffff]`} />;
    case 'Javascript': return <IoLogoJavascript {...iconProps} className={`${iconProps.className} text-[#f7df1e]`} />;
    default: return <FaCode {...iconProps} />;
  }
}

interface TechNodeProps {
  tech: Technology;
  x: number;
  y: number;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  index: number;
  categoryColor: string;
}

export default function TechNode({
  tech,
  x,
  y,
  isHovered,
  onHoverStart,
  onHoverEnd,
  index,
  categoryColor
}: TechNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Memoize the icon to prevent expensive switch cases on each float layout animation frame
  const memoizedIcon = useMemo(() => (
    <TechIcon name={tech.iconName} className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
  ), [tech.iconName]);

  const handleMouseEnter = () => {
    onHoverStart();
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    onHoverEnd();
    setShowTooltip(false);
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${(x / 800) * 100}%`,
        top: `${(y / 550) * 100}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 40 : 20,
      }}
    >
      <motion.div
        className="tech-node-card select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          borderColor: isHovered ? categoryColor : 'rgba(255, 255, 255, 0.06)',
          boxShadow: isHovered ? `0 0 20px ${categoryColor}40` : 'none',
          backgroundColor: isHovered ? 'rgba(5, 11, 23, 0.85)' : 'rgba(5, 11, 23, 0.65)'
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: index * 0.05 
        }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          {memoizedIcon}
          <div className="min-w-0">
            <h4 className="text-[10px] md:text-xs font-semibold text-gray-100 truncate tracking-wide">
              {tech.name}
            </h4>
            <p className="text-[8px] md:text-[9px] text-gray-400 mt-0.5 whitespace-nowrap">
              {tech.projectCount} Projects • <span className="text-[#ffd98a]">{tech.experience}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating Detailed Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="tooltip-panel p-4"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center gap-2 md:gap-2.5 pb-1.5 md:pb-2 mb-1.5 md:mb-2 border-b border-white/10">
              {memoizedIcon}
              <div>
                <h5 className="text-[10px] md:text-xs font-bold text-gray-100">{tech.name}</h5>
                <span 
                  className="text-[8px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-full border"
                  style={{ 
                    color: categoryColor, 
                    backgroundColor: `${categoryColor}15`,
                    borderColor: `${categoryColor}30`
                  }}
                >
                  {tech.experience}
                </span>
              </div>
            </div>
            
            <p className="text-[9px] md:text-[10px] text-gray-300 leading-relaxed mb-2 md:mb-3">
              {tech.description}
            </p>

            {tech.projects.length > 0 && (
              <div>
                <p className="text-[8px] md:text-[9px] font-semibold text-[#ffd98a] uppercase tracking-wider mb-1 md:mb-1.5">
                  Used in Projects
                </p>
                <ul className="space-y-1">
                  {tech.projects.map((proj, pIdx) => (
                    <li key={pIdx} className="text-[9px] md:text-[10px] text-gray-400 flex items-center gap-1 md:gap-1.5">
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: categoryColor }} />
                      {proj}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
