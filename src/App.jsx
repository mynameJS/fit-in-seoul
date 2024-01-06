import './App.css';
import UserBasicData from './components/RegisterForm/UserBasicData';
import UserInterestData from './components/RegisterForm/UserInterestData';
import UserProfileData from './components/RegisterForm/UserProfileData';

function App() {
  return (
    <>
      <UserBasicData />
      <UserInterestData />
      <UserProfileData />
    </>
  );
}
export default App;
