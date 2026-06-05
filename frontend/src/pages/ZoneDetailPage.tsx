import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getZoneById, getZonesSensors } from '../services/monitoringService';
import { Zone, ActiveSensor, EstadoOperativo } from '../types';
import SensorCard from '../components/SensorCard';

const estadoStyles: Record<EstadoOperativo, string> = {
  ACTIVA: 'bg-[#DCFCE7] text-[#10B981]',
  INACTIVA: 'bg-[#F1F5F9] text-[#94A3B8]',
  MANTENIMIENTO: 'bg-[#FEF3C7] text-[#F59E0B]',
};

function ZoneDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const zoneId = Number(id);

  const [zone, setZone] = useState<Zone | null>(null);
  const [sensors, setSensors] = useState<ActiveSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (Number.isNaN(zoneId)) {
      setError('Zona inválida');
      setLoading(false);
      return;
    }

    Promise.all([getZoneById(zoneId), getZonesSensors(zoneId)])
      .then(([zoneRes, sensorsRes]) => {
        setZone(zoneRes.data ?? null);
        setSensors(sensorsRes.data ?? []);
      })
      .catch(() => setError('No se pudo cargar la zona'))
      .finally(() => setLoading(false));
  }, [zoneId]);

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border border-[#E2E8F0] bg-[#F1F5F9]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="font-medium text-red-500">{error}</p>
      )}

      {!loading && !error && zone && (
        <>
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0F172A]">
                {zone.nombre}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[zone.estadoOperativo]}`}
              >
                {zone.estadoOperativo}
              </span>
            </div>
            <p className="mt-1 text-[#64748B]">{zone.descripcion}</p>
          </div>

          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            Sensores activos ({sensors.length})
          </h2>

          {sensors.length === 0 ? (
            <p className="rounded-xl border border-[#E2E8F0] bg-white p-6 text-center text-[#64748B] shadow-sm">
              No hay sensores activos en esta zona
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {sensors.map((sensor) => (
                <SensorCard key={sensor.id} sensor={sensor} />
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && !zone && (
        <p className="font-medium text-red-500">No se encontró la zona</p>
      )}
    </div>
  );
}

export default ZoneDetailPage;
