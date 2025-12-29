// src/components/ui/VehicleIcon.jsx - Ícones de Veículos com Font Awesome
import { Box, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faMotorcycle,
  faTruck,
  faVanShuttle,
  faTractor,
  faChargingStation,
  faBus,
  faBicycle,
} from '@fortawesome/free-solid-svg-icons';

const vehicleIcons = {
  carro: { icon: faCar, label: 'Carro', color: '#6366f1' },
  moto: { icon: faMotorcycle, label: 'Moto', color: '#f97316' },
  caminhao: { icon: faTruck, label: 'Caminhão', color: '#10b981' },
  van: { icon: faVanShuttle, label: 'Van', color: '#06b6d4' },
  trator: { icon: faTractor, label: 'Trator', color: '#84cc16' },
  eletrico: { icon: faChargingStation, label: 'Elétrico', color: '#22d3ee' },
  motocicleta: { icon: faMotorcycle, label: 'Motocicleta', color: '#ec4899' },
  onibus: { icon: faBus, label: 'Ônibus', color: '#8b5cf6' },
  bicicleta: { icon: faBicycle, label: 'Bicicleta', color: '#14b8a6' },
};

export default function VehicleIcon({ 
  type = 'carro', 
  size = 'medium', 
  selected = false,
  onClick,
  showLabel = false,
}) {
  const vehicle = vehicleIcons[(type || 'carro').toLowerCase()] || vehicleIcons.carro;

  const sizes = {
    small: { box: 36, icon: 16 },
    medium: { box: 48, icon: 20 },
    large: { box: 64, icon: 28 },
  };

  // Aceita número direto ou string predefinida
  const sizeConfig = typeof size === 'number' 
    ? { box: size + 12, icon: size }
    : (sizes[size] || sizes.medium);
  
  const { box, icon } = sizeConfig;

  return (
    <Tooltip title={vehicle.label} arrow placement="top">
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          cursor: onClick ? 'pointer' : 'default',
          '&:hover .vehicle-box': {
            background: `linear-gradient(135deg, ${vehicle.color}30, ${vehicle.color}15)`,
            borderColor: vehicle.color,
            transform: 'scale(1.05)',
          },
          '&:active .vehicle-box': {
            transform: 'scale(0.95)',
          },
        }}
      >
        <Box
          className="vehicle-box"
          sx={{
            width: box,
            height: box,
            borderRadius: '14px',
            background: selected
              ? `linear-gradient(135deg, ${vehicle.color}40, ${vehicle.color}20)`
              : 'rgba(255, 255, 255, 0.05)',
            border: selected
              ? `2px solid ${vehicle.color}`
              : '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            boxShadow: selected
              ? `0 0 20px ${vehicle.color}40`
              : 'none',
          }}
        >
          <FontAwesomeIcon
            icon={vehicle.icon}
            style={{
              fontSize: icon,
              color: selected ? vehicle.color : 'rgba(255,255,255,0.6)',
              transition: 'color 0.15s ease',
            }}
          />
        </Box>
        {showLabel && (
          <Box
            component="span"
            sx={{
              fontSize: '0.7rem',
              color: selected ? vehicle.color : 'text.secondary',
              fontWeight: selected ? 600 : 400,
            }}
          >
            {vehicle.label}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}

// Componente para seleção de tipo de veículo
export function VehicleTypeSelector({ value, onChange }) {
  const types = Object.keys(vehicleIcons);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 2,
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {types.map((type) => (
        <VehicleIcon
          key={type}
          type={type}
          selected={value === type}
          onClick={() => onChange(type)}
          showLabel
          size="medium"
        />
      ))}
    </Box>
  );
}
