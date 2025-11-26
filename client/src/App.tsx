import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OrderPlacement } from './pages/OrderPlacement';
import { KitchenMonitor } from './pages/KitchenMonitor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderPlacement />} />
        <Route path="/kitchen" element={<KitchenMonitor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
