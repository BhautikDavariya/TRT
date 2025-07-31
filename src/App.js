import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './components/auth/CreateAccountPage';
import LoginPage from './components/auth/LoginPage';
import DynamicTable from './components/Tables';
import Profile from './components/Profile';
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create" element={<CreateAccountPage />} />
        <Route path="/home" element={<DynamicTable />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
