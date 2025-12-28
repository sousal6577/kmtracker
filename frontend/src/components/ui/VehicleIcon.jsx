// src/components/ui/VehicleIcon.jsx - Ícones de Veículos Animados
import { Box, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  DirectionsCar,
  TwoWheeler,
  LocalShipping,
  AirportShuttle,
  Agriculture,
  ElectricCar,
  Motorcycle,
  DirectionsBus,
} from '@mui/icons-material';

const vehicleIcons = {
  carro: { icon: DirectionsCar, label: 'Carro', color: '#6366f1' },
  moto: { icon: TwoWheeler, label: 'Moto', color: '#f97316' },
  caminhao: { icon: LocalShipping, label: 'Caminhão', color: '#10b981' },
  van: { icon: AirportShuttle, label: 'Van', color: '#06b6d4' },
  trator: { icon: Agriculture, label: 'Trator', color: '#84cc16' },
  eletrico: { icon: ElectricCar, label: 'Elétrico', color: '#22d3ee' },
  motocicleta: { icon: Motorcycle, label: 'Motocicleta', color: '#ec4899' },
  onibus: { icon: DirectionsBus, label: 'Ônibus', color: '#8b5cf6' },
};

export default function VehicleIcon({ 
  type = 'carro', 
  size = 'medium', 
  selected = false,
  onClick,
  showLabel = false,
}) {
  const vehicle = vehicleIcons[type.toLowerCase()] || vehicleIcons.carro;
  const IconComponent = vehicle.icon;

  const sizes = {
    small: { box: 36, icon: 20 },
    medium: { box: 48, icon: 26 },
    large: { box: 64, icon: 34 },
  };

  const { box, icon } = sizes[size];

  return (
    <Tooltip title={vehicle.label} arrow placement="top">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
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
              transition: 'all 0.2s ease',
              boxShadow: selected
                ? `0 0 20px ${vehicle.color}40`
                : 'none',
              '&:hover': {
                background: `linear-gradient(135deg, ${vehicle.color}30, ${vehicle.color}15)`,
                borderColor: vehicle.color,
              },
            }}
          >
            <IconComponent
              sx={{
                fontSize: icon,
                color: selected ? vehicle.color : 'text.secondary',
                transition: 'color 0.2s ease',
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
      </motion.div>
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
