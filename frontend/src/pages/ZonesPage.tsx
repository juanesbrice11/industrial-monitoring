import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { getZones } from '../services/monitoringService';
import { Zone } from '../types';
import ZoneCard from '../components/ZoneCard';

function ZonesPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getZones()
      .then((res) => {
        if (res.success) setZones(res.data ?? []);
        else setError(res.error ?? 'No se pudieron cargar las zonas');
      })
      .catch(() => setError('No se pudieron cargar las zonas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Zonas de Monitoreo
          </h1>
          <p className="mt-1 text-[#64748B]">
            Selecciona una zona para ver sus sensores activos
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/assign')}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Asignar Sensor
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl border border-[#E2E8F0] bg-[#F1F5F9]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ZonesPage;
