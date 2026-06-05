import { useMemo } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { ActiveSensor, EstadoMonitoreo, TipoLectura } from '../types';

interface SensorCardProps {
  sensor: ActiveSensor;
}

const estadoStyles: Record<EstadoMonitoreo, string> = {
  ACTIVO: 'bg-[#DCFCE7] text-[#10B981]',
  PAUSADO: 'bg-[#F1F5F9] text-[#94A3B8]',
};

// Rango y unidad de la lectura simulada según el tipo de lectura
const RANGOS: Record<TipoLectura, { min: number; max: number; unidad: string }> = {
  TEMPERATURA: { min: 20, max: 120, unidad: '°C' },
  PRESION: { min: 50, max: 200, unidad: 'PSI' },
  VIBRACION: { min: 0, max: 80, unidad: 'Hz' },
  FLUJO: { min: 30, max: 250, unidad: 'L/min' },
};

function SensorCard({ sensor }: SensorCardProps) {
  const estado = sensor.estado;

  // Lectura actual simulada, estable entre renders (solo cambia si cambia el sensor)
  const lecturaActual = useMemo(() => {
    const { min, max } = RANGOS[sensor.tipoLectura];
    return Math.round((min + Math.random() * (max - min)) * 10) / 10;
  }, [sensor.id, sensor.tipoLectura]);

  const { unidad } = RANGOS[sensor.tipoLectura];
  const superaUmbral = lecturaActual > sensor.valorUmbral;

  return (
    <div
      className={`rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm ${
        superaUmbral ? 'border-l-4 border-l-red-500' : ''
      } ${estado === 'PAUSADO' ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-[#0F172A]">{sensor.nombre}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[estado]}`}
        >
          {estado}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#3B82F6]">
          {sensor.tipoLectura}
        </span>
        <span className="text-sm text-[#64748B]">{sensor.fabricante}</span>
      </div>

      <div className="mt-4 space-y-1">
        <p
          className={`text-sm font-semibold ${
            superaUmbral ? 'text-[#EF4444]' : 'text-[#10B981]'
          }`}
        >
          Lectura actual: {lecturaActual} {unidad}
        </p>
        <p className="text-sm text-[#64748B]">
          Umbral configurado: {sensor.valorUmbral} {unidad}
        </p>
      </div>

      {superaUmbral ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#EF4444]">
          <AlertTriangle className="h-4 w-4" />⚠ Valor por encima del umbral
        </p>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
          <CheckCircle className="h-4 w-4" />
          Dentro de rango
        </p>
      )}
    </div>
  );
}

export default SensorCard;
