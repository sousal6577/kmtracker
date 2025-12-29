// src/components/ui/GPSLogo.jsx - Logo GPS Personalizado KMTracker
import { Box, Typography } from '@mui/material';

export default function GPSLogo({ size = 'medium', showText = true, variant = 'full' }) {
  const sizes = {
    small: { logo: 32, text: '1rem' },
    medium: { logo: 44, text: '1.25rem' },
    large: { logo: 64, text: '1.75rem' },
    xlarge: { logo: 80, text: '2rem' },
  };

  const sizeConfig = typeof size === 'number' 
    ? { logo: size, text: `${size * 0.025}rem` }
    : (sizes[size] || sizes.medium);
  
  const { logo: logoSize, text: textSize } = sizeConfig;

  // SVG do ícone GPS personalizado
  const GPSIcon = ({ size }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fundo gradiente */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Fundo arredondado */}
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#bgGradient)" />
      
      {/* Círculo de radar/sinal GPS */}
      <circle cx="32" cy="28" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="28" r="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="28" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
      
      {/* Pin de localização */}
      <g filter="url(#glow)">
        <path 
          d="M32 12C25.4 12 20 17.4 20 24C20 32 32 44 32 44C32 44 44 32 44 24C44 17.4 38.6 12 32 12Z" 
          fill="url(#pinGradient)"
        />
        <circle cx="32" cy="24" r="5" fill="#6366f1" />
      </g>
      
      {/* Estrada/Rota */}
      <path 
        d="M10 52 Q22 48 32 50 Q42 52 54 48" 
        stroke="url(#roadGradient)" 
        strokeWidth="3" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Linha tracejada da estrada */}
      <path 
        d="M14 52 Q24 49 32 50 Q40 51 50 48" 
        stroke="rgba(255,255,255,0.5)" 
        strokeWidth="1" 
        strokeDasharray="4 3"
        fill="none"
      />
      
      {/* Carro pequeno na estrada */}
      <g transform="translate(28, 47)">
        <rect x="0" y="0" width="8" height="4" rx="1.5" fill="#f8fafc" />
        <circle cx="2" cy="4" r="1.2" fill="#1e293b" />
        <circle cx="6" cy="4" r="1.2" fill="#1e293b" />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return <GPSIcon size={logoSize} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        '&:hover .gps-logo': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* Logo Icon */}
      <Box
        className="gps-logo"
        sx={{
          transition: 'transform 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.4))',
        }}
      >
        <GPSIcon size={logoSize} />
      </Box>

      {/* Logo Text */}
      {showText && (
        <Box>
          <Typography
            sx={{
              fontSize: textSize,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}
          >
            KMTracker
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: 'text.secondary',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              mt: 0.2,
            }}
          >
            Rastreamento
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// Exporta o ícone SVG separadamente para uso em favicons etc
export const GPSIconSVG = ({ size = 64, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    
    <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#bgGrad)" />
    
    <circle cx="32" cy="28" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
    <circle cx="32" cy="28" r="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
    <circle cx="32" cy="28" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
    
    <path 
      d="M32 12C25.4 12 20 17.4 20 24C20 32 32 44 32 44C32 44 44 32 44 24C44 17.4 38.6 12 32 12Z" 
      fill="url(#pinGrad)"
    />
    <circle cx="32" cy="24" r="5" fill="#6366f1" />
    
    <path 
      d="M10 52 Q22 48 32 50 Q42 52 54 48" 
      stroke="url(#roadGrad)" 
      strokeWidth="3" 
      strokeLinecap="round"
      fill="none"
    />
    <path 
      d="M14 52 Q24 49 32 50 Q40 51 50 48" 
      stroke="rgba(255,255,255,0.5)" 
      strokeWidth="1" 
      strokeDasharray="4 3"
      fill="none"
    />
    
    <g transform="translate(28, 47)">
      <rect x="0" y="0" width="8" height="4" rx="1.5" fill="#f8fafc" />
      <circle cx="2" cy="4" r="1.2" fill="#1e293b" />
      <circle cx="6" cy="4" r="1.2" fill="#1e293b" />
    </g>
  </svg>
);
