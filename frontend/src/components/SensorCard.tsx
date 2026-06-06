import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Settings, X } from 'lucide-react';
import { ActiveSensor, EstadoMonitoreo, TipoLectura } from '../types';
import { updateMonitoring } from '../services/monitoringService';
import { RANGOS_UMBRAL, validarUmbral } from '../utils/umbral';

interface SensorCardProps {
  sensor: ActiveSensor;
  onUpdate?: () => void;
}

const estadoStyles: Record<EstadoMonitoreo, string> = {
  ACTIVO: 'bg-[#DCFCE7] text-[#10B981]',
  PAUSADO: 'bg-[#F1F5F9] text-[#94A3B8]',
};

// Rango y unidad de la LECTURA simulada según el tipo de lectura
const RANGOS_LECTURA: Record<
  TipoLectura,
  { min: number; max: number; unidad: string }
> = {
  TEMPERATURA: { min: 20, max: 120, unidad: '°C' },
  PRESION: { min: 50, max: 200, unidad: 'PSI' },
  VIBRACION: { min: 0, max: 80, unidad: 'Hz' },
  FLUJO: { min: 30, max: 250, unidad: 'L/min' },
};

// Extrae el mensaje de error del backend si existe
const getBackendError = (err: unknown, fallback: string): string =>
  (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
  fallback;

function SensorCard({ sensor, onUpdate }: SensorCardProps) {
  const estado = sensor.estado;

  // Lectura actual simulada, estable entre renders (solo cambia si cambia el sensor)
  const lecturaActual = useMemo(() => {
    const { min, max } = RANGOS_LECTURA[sensor.tipoLectura];
    return Math.round((min + Math.random() * (max - min)) * 10) / 10;
  }, [sensor.id, sensor.tipoLectura]);

  const { unidad } = RANGOS_LECTURA[sensor.tipoLectura];
  const superaUmbral = lecturaActual > sensor.valorUmbral;

  // Estado del panel de edición
  const [open, setOpen] = useState(false);
  const [umbralInput, setUmbralInput] = useState(String(sensor.valorUmbral));
  const [saving, setSaving] = useState(false);
  const [panelError, setPanelError] = useState('');
  const [panelMensaje, setPanelMensaje] = useState('');

  const abrirPanel = () => {
    setUmbralInput(String(sensor.valorUmbral));
    setPanelError('');
    setPanelMensaje('');
    setOpen(true);
  };

  const handleToggleEstado = async () => {
    setPanelError('');
    setPanelMensaje('');
    setSaving(true);
    try {
      const nuevoEstado: EstadoMonitoreo =
        estado === 'ACTIVO' ? 'PAUSADO' : 'ACTIVO';
      const res = await updateMonitoring(sensor.monitoringId, {
        estado: nuevoEstado,
      });
      if (res.success) {
        setPanelMensaje('Monitoreo actualizado');
        onUpdate?.();
      } else {
        setPanelError(res.error ?? 'No se pudo actualizar el monitoreo');
      }
    } catch (err) {
      setPanelError(getBackendError(err, 'No se pudo actualizar el monitoreo'));
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarUmbral = async () => {
    setPanelError('');
    setPanelMensaje('');

    const errorUmbral = validarUmbral(Number(umbralInput), sensor.tipoLectura);
    if (errorUmbral) {
      setPanelError(errorUmbral);
      return;
    }

    setSaving(true);
    try {
      const res = await updateMonitoring(sensor.monitoringId, {
        valorUmbral: Number(umbralInput),
      });
      if (res.success) {
        setPanelMensaje('Monitoreo actualizado');
        onUpdate?.();
      } else {
        setPanelError(res.error ?? 'No se pudo actualizar el monitoreo');
      }
    } catch (err) {
      setPanelError(getBackendError(err, 'No se pudo actualizar el monitoreo'));
    } finally {
      setSaving(false);
    }
  };

  const rango = RANGOS_UMBRAL[sensor.tipoLectura];

  return (
    <>
      <div
        className={`rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm ${
          superaUmbral ? 'border-l-4 border-l-red-500' : ''
        } ${estado === 'PAUSADO' ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#0F172A]">{sensor.nombre}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[estado]}`}
            >
              {estado}
            </span>
            <button
              type="button"
              onClick={abrirPanel}
              aria-label="Configurar monitoreo"
              className="text-[#64748B] transition hover:text-[#0F172A]"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
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

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-[#0F172A]">{sensor.nombre}</h4>
                <p className="text-sm text-[#64748B]">
                  Configurar monitoreo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-[#64748B] transition hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Toggle de estado */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-[#0F172A]">Estado</p>
              <button
                type="button"
                onClick={handleToggleEstado}
                disabled={saving}
                className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2 font-medium text-[#0F172A] transition hover:bg-[#F8FAFC] disabled:opacity-60"
              >
                {estado === 'ACTIVO' ? 'Pausar monitoreo' : 'Activar monitoreo'}
              </button>
            </div>

            {/* Editar umbral */}
            <div className="mt-5 border-t border-[#E2E8F0] pt-5">
              <label
                htmlFor={`umbral-${sensor.monitoringId}`}
                className="mb-1 block text-sm font-medium text-[#0F172A]"
              >
                Valor umbral ({rango.unidad})
              </label>
              <div className="flex gap-2">
                <input
                  id={`umbral-${sensor.monitoringId}`}
                  type="number"
                  min="1"
                  step="0.1"
                  value={umbralInput}
                  onChange={(e) => setUmbralInput(e.target.value)}
                  placeholder={`${rango.min}-${rango.max}`}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleGuardarUmbral}
                  disabled={saving}
                  className="rounded-lg bg-[#3B82F6] px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  Guardar
                </button>
              </div>
            </div>

            {panelMensaje && (
              <p className="mt-4 text-sm font-medium text-[#10B981]">
                {panelMensaje}
              </p>
            )}
            {panelError && (
              <p className="mt-4 text-sm font-medium text-red-500">
                {panelError}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SensorCard;
