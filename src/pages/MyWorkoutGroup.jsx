import { useState, useEffect } from 'react';
import { fetchPostingData } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import PostingTableList from '../components/PostingTableList';
import PostingCard from '../components/PostingCard';

export default function MyWorkoutGroup() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [myPosting, setMyPosting] = useState([]);
  const [applyPosting, setApplyPosting] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPostingData = async () => {
      try {
        const postingData = await fetchPostingData();
        const filterMyPosting = postingData.filter(({ writer }) => currentUser.id === writer);
        const filterApplyPosting = postingData.filter(({ id }) => currentUser.userApplyPosting?.includes(id));
        setMyPosting(filterMyPosting);
        setApplyPosting(filterApplyPosting);
      } catch (error) {
        console.error('Error fetching posting data:', error);
      } finally {
        setLoading(false);
      }
    };

    getPostingData();
  }, []);

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      <div className="w-1/2 h-screen bg-sky-50 flex flex-col gap-10">
        <div className="flex flex-col items-center">
          <p className="text-3xl text-slate-600 mt-5">내 운동모임</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>내가 작성한 운동 모임</p>
          <div>
            <PostingTableList>
              {myPosting.map(data => (
                <PostingCard key={data.id} data={data} />
              ))}
            </PostingTableList>
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex flex-col items-center gap-2">
          <p>내가 신청한 운동 모임</p>
          <div>
            <PostingTableList>
              {applyPosting.map(data => (
                <PostingCard key={data.id} data={data} />
              ))}
            </PostingTableList>
          </div>
        </div>
        <button
          onClick={() => {
            navigate('/home');
          }}>
          홈으로
        </button>
      </div>
    </div>
  );
}
