import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLoginUserData } from '../config/firebase';
import { logOutUser } from '../config/firebase';
import Footer from '../components/Layout/footer';
import Carousel from '../components/Layout/carousel';
import Spinner from '../components/Spinner';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const currentUserDataInfo = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentLoginUserInfo = await fetchLoginUserData();
        const { userPassword, ...needUserData } = currentLoginUserInfo;
        localStorage.setItem('currentUser', JSON.stringify(needUserData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogoutClick = async () => {
    const result = confirm('정말 로그아웃 하시겠습니까?');
    if (result) {
      await logOutUser();
      localStorage.removeItem('currentUser');
      navigate('/login');
    }
  };

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex  justify-center">
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-3/4 flex flex-col justify-between">
          <div className="navbar flex justify-between bg-sky-50">
            <div>
              <a className="btn btn-ghost text-slate-800 text-xl">Fit-In-Seoul</a>
            </div>
            <ul className="flex gap-10">
              <li
                onClick={() => {
                  navigate('/recommend');
                }}
                className="btn btn-ghost">
                추천회원
              </li>
              <li
                onClick={() => {
                  navigate('/group');
                }}
                className="btn btn-ghost">
                내 운동 모임
              </li>
              <li
                onClick={() => {
                  navigate('/search');
                }}
                className="btn btn-ghost">
                운동모임찾기
              </li>
              <li
                onClick={() => {
                  navigate('/friend');
                }}
                className="btn btn-ghost">
                내 운동친구
              </li>
            </ul>
            <div className="gap-2">
              <div className="form-control">
                <p className="text-sm font-semibold">{currentUserDataInfo.userNickName}</p>
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img alt="유저 사진" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li>
                    <button
                      className="justify-between"
                      onClick={() => {
                        navigate('/info');
                      }}>
                      Profile
                      <span className="badge">New</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={handleLogoutClick}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Carousel />
          <Footer />
        </div>
      )}
    </div>
  );
}
