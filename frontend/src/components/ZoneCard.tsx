import { useNavigate } from 'react-router-dom';
import { MapPin, Radio } from 'lucide-react';
import { Zone, EstadoOperativo } from '../types';

interface ZoneCardProps {
  zone: Zone;
}

const estadoStyles: Record<EstadoOperativo, string> = {
  ACTIVA: 'bg-[#DCFCE7] text-[#10B981]',
  INACTIVA: 'bg-[#F1F5F9] text-[#94A3B8]',
  MANTENIMIENTO: 'bg-[#FEF3C7] text-[#F59E0B]',
};

function ZoneCard({ zone }: ZoneCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/zones/${zone.id}`)}
      className="flex flex-col items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-[#0F172A]">{zone.nombre}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[zone.estadoOperativo]}`}
        >
          {zone.estadoOperativo}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
        <MapPin className="h-4 w-4" />
        <span>{zone.ubicacion}</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
        <Radio className="h-4 w-4 text-[#3B82F6]" />
        <span>
          {zone.sensoresActivos ?? 0} sensores activos
        </span>
      </div>
    </button>
  );
}

export default ZoneCard;
