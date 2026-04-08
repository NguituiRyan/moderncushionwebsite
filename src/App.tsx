import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Configurator from './components/Configurator';
import VehicleSelector from './components/VehicleSelector';
import CapacitySelector from './components/CapacitySelector';
import AutomotiveCatalog from './components/AutomotiveCatalog';
import StadiaCatalog from './components/StadiaCatalog';
import WhatsAppWidget from './components/WhatsAppWidget';
import './index.css';

export type PageView = 'landing' | 'automotive' | 'stadia' | 'vehicle-selector' | 'capacity-selector' | 'configurator';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [selectedVehicle, setSelectedVehicle] = useState<'nissan' | 'toyota'>('nissan');
  const [selectedCapacity, setSelectedCapacity] = useState<'7L' | '9L'>('7L');

  const renderPage = () => {
    switch (currentPage) {
      case 'configurator':
        return <Configurator vehicleType={selectedVehicle} capacity={selectedCapacity} onBack={() => setCurrentPage('capacity-selector')} />;
      case 'capacity-selector':
        return <CapacitySelector
                 vehicleType={selectedVehicle}
                 onSelect={(c) => { setSelectedCapacity(c); setCurrentPage('configurator'); }}
                 onBack={() => setCurrentPage('vehicle-selector')}
               />;
      case 'vehicle-selector':
        return <VehicleSelector
                 onSelect={(v) => { setSelectedVehicle(v); setCurrentPage('capacity-selector'); }}
                 onBack={() => setCurrentPage('landing')}
               />;
      case 'automotive':
        return <AutomotiveCatalog onBack={() => setCurrentPage('landing')} onStartConfigurator={() => setCurrentPage('vehicle-selector')} />;
      case 'stadia':
        return <StadiaCatalog onBack={() => setCurrentPage('landing')} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={(page) => setCurrentPage(page as PageView)} />;
    }
  };

  return (
    <>
      {renderPage()}
      <WhatsAppWidget />
    </>
  );
}

export default App;
