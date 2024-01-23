import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { updateData } from '../config/firebase';

export default function MyInfo() {
  const navigate = useNavigate();
  const myInfo = JSON.parse(localStorage.getItem('currentUser'));
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState(myInfo.userIntroduce);

  const editIntroduceHandler = async () => {
    const userId = myInfo.id;
    const { id, userIntroduce, ...preData } = myInfo;
    const newData = {
      ...preData,
      userIntroduce: editValue,
    };
    await updateData(userId, newData);
    localStorage.setItem('currentUser', JSON.stringify({ ...myInfo, userIntroduce: editValue }));
    setIsEdit(!isEdit);
  };

  console.log(myInfo);
  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center gap-3">
      <div>
        <p className="text-2xl mt-5 text-slate-600">{myInfo.userNickName}님의 정보</p>
      </div>
      <div className="w-1/3 h-2/3 bg-sky-50 rounded-lg flex flex-col border-double border-4 border-sky-400">
        <div className="flex">
          <div className="avatar p-8">
            <div className="w-32 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div className="text-sm flex flex-col justify-center gap-2">
            <p>성별 : {myInfo.gender === 'male' ? '남성' : '여성'}</p>
            <p>관심사 : {myInfo.interest.map(int => `${int} `)}</p>
            <p>사는 곳 : {myInfo.residence}</p>
          </div>
        </div>
        <div>
          <div className="text-sm flex flex-col items-center">
            <p>자기소개</p>
            {isEdit && (
              <div className="flex flex-col gap-3 items-center">
                <textarea
                  className="textarea textarea-bordered"
                  value={editValue}
                  onChange={e => {
                    setEditValue(e.target.value);
                  }}
                />
                <button className="btn btn-outline btn-xs" onClick={editIntroduceHandler}>
                  수정하기
                </button>
              </div>
            )}
            {!isEdit && (
              <div>
                <p>{myInfo.userIntroduce}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex text-sm gap-5 justify-center mt-20">
          <button
            onClick={() => {
              setIsEdit(!isEdit);
            }}>
            프로필 편집
          </button>
          <button
            onClick={() => {
              navigate('/home');
            }}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
