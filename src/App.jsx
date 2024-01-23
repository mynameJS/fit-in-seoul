import './App.css';
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import UserBasicData from './components/RegisterForm/UserBasicData';
import UserInterestData from './components/RegisterForm/UserInterestData';
import UserProfileData from './components/RegisterForm/UserProfileData';
import RecommendUsers from './pages/RecommendUsers';
import MyWorkoutGroup from './pages/MyWorkoutGroup';
import MyWorkoutFriend from './pages/MyWorkoutFriend';
import FindWorkoutSearch from './pages/FindWorkoutSearch';
import MyInfo from './pages/MyInfo';
import YourInfo from './pages/YourInfo';
import PostingForm from './pages/PostingForm';
import PostingDetails from './pages/PostingDetails';
import PostingEdit from './pages/PostingEdit';

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
      <Route path="/group" element={<MyWorkoutGroup />} />
      <Route path="/friend" element={<MyWorkoutFriend />} />
      <Route path="/search" element={<FindWorkoutSearch />} />
      <Route path="/info" element={<MyInfo />} />
      <Route path="/yourInfo" element={<YourInfo />} />
      <Route path="/posting" element={<PostingForm />} />
      <Route path="/postingDetails" element={<PostingDetails />} />
      <Route path="/postingEdit" element={<PostingEdit />} />
    </Routes>
  );
}
export default App;
