import './App.css';
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import LoginForm from './components/LoginForm';
import UserBasicData from './components/RegisterForm/UserBasicData';
import UserInterestData from './components/RegisterForm/UserInterestData';
import UserProfileData from './components/RegisterForm/UserProfileData';
import RecommendUsers from './pages/RecommendUsers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register_basic" element={<UserBasicData />} />
      <Route path="/register_interest" element={<UserInterestData />} />
      <Route path="/register_profile" element={<UserProfileData />} />
      <Route path="/recommend" element={<RecommendUsers />} />
    </Routes>
  );
}
export default App;
