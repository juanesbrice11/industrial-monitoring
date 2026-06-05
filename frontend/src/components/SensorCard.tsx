import { AlertTriangle } from 'lucide-react';
import { ActiveSensor, EstadoMonitoreo } from '../types';

interface SensorCardProps {
  sensor: ActiveSensor;
}

const estadoStyles: Record<EstadoMonitoreo, string> = {
  ACTIVO: 'bg-[#DCFCE7] text-[#10B981]',
  PAUSADO: 'bg-[#F1F5F9] text-[#94A3B8]',
};

function SensorCard({ sensor }: SensorCardProps) {
  const umbralElevado = sensor.valorUmbral > 80;
  const estado: EstadoMonitoreo = sensor.estado ?? 'ACTIVO';

  return (
    <div
      className={`rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm ${
        umbralElevado ? 'border-l-4 border-l-red-500' : ''
      }`}
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

      <div className="mt-4 flex items-center gap-2">
        <AlertTriangle
          className={`h-4 w-4 ${umbralElevado ? 'text-red-500' : 'text-[#64748B]'}`}
        />
        <span className="text-sm font-medium text-[#0F172A]">
          Umbral: {sensor.valorUmbral}
        </span>
      </div>

      {umbralElevado && (
        <p className="mt-2 text-sm font-medium text-red-500">
          ⚠ Umbral elevado
        </p>
      )}
    </div>
  );
}

export default SensorCard;
