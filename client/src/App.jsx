import { Routes, Route } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';

function App() {
  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
export default App;
