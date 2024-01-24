import { useNavigate, Link } from 'react-router-dom';
import { fetchPostingData } from '../config/firebase';
import { useState, useEffect } from 'react';
import { location, interestList } from '../constant/constant';
import Spinner from '../components/Spinner';
import PostingTableList from '../components/PostingTableList';

export default function FindWorkoutSearch() {
  const navigate = useNavigate();
  const [postingData, setPostingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [filterKey, setFilterKey] = useState({
    category: '',
    location: '',
  });
  const renderPostingData = [...postingData].sort((a, b) => b.createTime - a.createTime);
  const filteredPostingData = renderPostingData.filter(item => {
    if (filterKey.category && filterKey.location) {
      return item.category === filterKey.category && item.location === filterKey.location;
    } else if (filterKey.category) {
      return item.category === filterKey.category;
    } else if (filterKey.location) {
      return item.location === filterKey.location;
    } else {
      return true;
    }
  });

  const itemsPerPage = 4;
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPostingData.slice(startIndex, endIndex);
  };

  const handlePreButtonClick = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextButtonClick = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, maxPage));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFilterKey({ ...filterKey, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postingData = await fetchPostingData();
        setPostingData(postingData);
      } catch (error) {
        console.error('Error fetching posting data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setMaxPage(Math.ceil(filteredPostingData.length / itemsPerPage));
  }, [filteredPostingData, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey]);

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-3/4 h-screen bg-sky-50 flex flex-col gap-10">
          <div className="flex flex-col items-center">
            <p className="text-3xl text-slate-600 mt-5">운동모임찾기</p>
          </div>
          <div className="flex flex-row-reverse justify-center items-center gap-20">
            <div>
              <button
                className="btn btn-active btn-neutral btn-sm"
                onClick={() => {
                  navigate('/posting');
                }}>
                글쓰기
              </button>
            </div>
            <div className="basis-2/3">
              <form className="flex gap-2 justify-center">
                <label htmlFor="category"></label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  id="category"
                  name="category"
                  value={filterKey.category}
                  onChange={handleChange}>
                  <option value="">운동종목을 선택해주세요</option>
                  {interestList.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label htmlFor="location"></label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  id="location"
                  name="location"
                  value={filterKey.location}
                  onChange={handleChange}>
                  <option value="">구를 선택해주세요</option>
                  {location.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </form>
            </div>
          </div>
          <div>
            <PostingTableList>
              {getCurrentPageData().map(data => (
                <PostingCard key={data.id} data={data} />
              ))}
            </PostingTableList>
            {!getCurrentPageData().length && <p className="p-5">일치하는 게시물이 없습니다.</p>}
          </div>
          {!!getCurrentPageData().length && (
            <div className="flex justify-center items-center gap-2">
              <button
                className="btn btn-active btn-neutral btn-sm"
                onClick={handlePreButtonClick}
                disabled={currentPage === 1}>
                이전
              </button>
              <span>
                {currentPage} / {maxPage}
              </span>
              <button
                className="btn btn-active btn-neutral btn-sm"
                onClick={handleNextButtonClick}
                disabled={currentPage === maxPage}>
                다음
              </button>
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="btn btn-active btn-neutral btn-sm"
              onClick={() => {
                navigate('/home');
              }}>
              홈으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PostingCard({ data }) {
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="userAvatar" />
            </div>
          </div>
          <div>
            <div className="font-bold">{data.writerNickName}</div>
          </div>
        </div>
      </td>
      <td>{data.category}</td>
      <td>{data.count}</td>
      <td>{data.date}</td>
      <td>{data.location}</td>
      <th>
        <Link to={'/postingDetails'} state={{ selectedPostingId: data.id }}>
          <button className="btn btn-ghost btn-xs">상세정보</button>
        </Link>
      </th>
    </tr>
  );
}
