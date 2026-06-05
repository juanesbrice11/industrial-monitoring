import { useEffect, useState, FormEvent } from 'react';
import {
  getSensors,
  getZones,
  createMonitoring,
} from '../services/monitoringService';
import {
  Sensor,
  Zone,
  TipoLectura,
  EstadoMonitoreo,
} from '../types';

const TIPOS_LECTURA: TipoLectura[] = [
  'TEMPERATURA',
  'PRESION',
  'VIBRACION',
  'FLUJO',
];
const ESTADOS: EstadoMonitoreo[] = ['ACTIVO', 'PAUSADO'];

// Rango válido de valorUmbral según el tipo de lectura
const RANGOS_UMBRAL: Record<
  TipoLectura,
  { min: number; max: number; unidad: string; ejemplo: string }
> = {
  TEMPERATURA: { min: 1, max: 500, unidad: '°C', ejemplo: '85.0' },
  PRESION: { min: 1, max: 1000, unidad: 'PSI', ejemplo: '120.0' },
  VIBRACION: { min: 1, max: 200, unidad: 'Hz', ejemplo: '50.0' },
  FLUJO: { min: 1, max: 1000, unidad: 'L/min', ejemplo: '200.0' },
};

const inputClass =
  'w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'mb-1 block font-medium text-[#0F172A]';

interface MonitoringFormProps {
  onSuccess?: () => void;
}

function MonitoringForm({ onSuccess }: MonitoringFormProps) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [sensorId, setSensorId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [tipoLectura, setTipoLectura] = useState<TipoLectura>('TEMPERATURA');
  const [valorUmbral, setValorUmbral] = useState('');
  const [fechaInstalacion, setFechaInstalacion] = useState('');
  const [estado, setEstado] = useState<EstadoMonitoreo>('ACTIVO');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [umbralError, setUmbralError] = useState('');

  useEffect(() => {
    getSensors()
      .then((res) => setSensors(res.data ?? []))
      .catch(() => setError('No se pudieron cargar los sensores'));
    getZones()
      .then((res) => setZones(res.data ?? []))
      .catch(() => setError('No se pudieron cargar las zonas'));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setUmbralError('');

    if (!sensorId || !zoneId || !valorUmbral || !fechaInstalacion) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validación cliente del valorUmbral (no envía la petición si falla)
    const umbralNum = Number(valorUmbral);
    const rango = RANGOS_UMBRAL[tipoLectura];
    if (Number.isNaN(umbralNum) || umbralNum <= 0) {
      setUmbralError('El valor umbral debe ser un número mayor a 0');
      return;
    }
    if (umbralNum < rango.min || umbralNum > rango.max) {
      setUmbralError(
        `El valor umbral para ${tipoLectura} debe estar entre ${rango.min} y ${rango.max} ${rango.unidad}`
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await createMonitoring({
        sensorId: Number(sensorId),
        zoneId: Number(zoneId),
        tipoLectura,
        valorUmbral: Number(valorUmbral),
        fechaInstalacion,
        estado,
      });

      if (res.success) {
        setSuccess(res.message ?? 'Monitoreo creado correctamente');
        onSuccess?.();
      } else {
        setError(res.error ?? 'No se pudo crear el monitoreo');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Ocurrió un error al crear el monitoreo';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="sensor">
            Sensor
          </label>
          <select
            id="sensor"
            className={inputClass}
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          >
            <option value="">Selecciona un sensor</option>
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="zone">
            Zona
          </label>
          <select
            id="zone"
            className={inputClass}
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
          >
            <option value="">Selecciona una zona</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="tipoLectura">
            Tipo de lectura
          </label>
          <select
            id="tipoLectura"
            className={inputClass}
            value={tipoLectura}
            onChange={(e) => setTipoLectura(e.target.value as TipoLectura)}
          >
            {TIPOS_LECTURA.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="valorUmbral">
            Valor umbral
          </label>
          <input
            id="valorUmbral"
            type="number"
            min="1"
            step="0.1"
            className={inputClass}
            value={valorUmbral}
            onChange={(e) => setValorUmbral(e.target.value)}
            placeholder={`Ej: ${RANGOS_UMBRAL[tipoLectura].ejemplo} (${RANGOS_UMBRAL[tipoLectura].min}-${RANGOS_UMBRAL[tipoLectura].max} ${RANGOS_UMBRAL[tipoLectura].unidad})`}
          />
          {umbralError && (
            <p className="mt-1 text-sm text-red-500">{umbralError}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="fechaInstalacion">
            Fecha de instalación
          </label>
          <input
            id="fechaInstalacion"
            type="date"
            className={inputClass}
            value={fechaInstalacion}
            onChange={(e) => setFechaInstalacion(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            className={inputClass}
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoMonitoreo)}
          >
            {ESTADOS.map((es) => (
              <option key={es} value={es}>
                {es}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 rounded-lg bg-[#3B82F6] px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Asignando...' : 'Asignar Sensor'}
      </button>

      {success && (
        <p className="mt-4 font-medium text-[#10B981]">{success}</p>
      )}
      {error && <p className="mt-4 font-medium text-red-500">{error}</p>}
    </form>
  );
}

export default MonitoringForm;
