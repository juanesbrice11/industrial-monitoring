import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MonitoringForm from '../components/MonitoringForm';

function AssignPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <h1 className="text-2xl font-bold text-[#0F172A]">
        Asignar Sensor a Zona
      </h1>
      <p className="mb-6 mt-1 text-[#64748B]">
        Vincula un sensor a una zona definiendo su umbral y estado de monitoreo
      </p>

      <MonitoringForm onSuccess={handleSuccess} />
    </div>
  );
}

export default AssignPage;
