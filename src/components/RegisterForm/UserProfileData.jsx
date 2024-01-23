import { useState } from 'react';
import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';
import { userNickNameValidation } from './validation';
import { addData, addNewUser } from '../../config/firebase.js';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase.js';

// const UserProfileContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   margin: 30% auto;
// `;

// const UserProfileForm = styled.form`
//   display: flex;
//   flex-direction: column;
//   width: 20%;
//   border: 1px solid black;
//   padding: 10px;
// `;

export default function UserProfileData() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useRecoilState(userInputState);
  const [formData, setFormData] = useState({
    userNickName: '',
    userIntroduce: '',
  });
  const isGoogle = auth.currentUser?.providerData[0]?.providerId === 'google.com';

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!userNickNameValidation(formData.userNickName)) {
      alert('닉네임은 8자 이하에 특수문자나 공백이 포함될 수 없습니다.');
      return;
    }
    setUserInput(prevUserInput => {
      const updatedUserInput = { ...prevUserInput, ...formData };
      // 구글사용자 아니라면
      if (!isGoogle) {
        addNewUser(userInput.userEmail, userInput.userPassword);
      }
      addData(updatedUserInput);
      return updatedUserInput;
    });
    alert('회원가입이 완료되었습니다');
    if (!isGoogle) {
      navigate('/login');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="bg-sky-100 h-screen text-slate-500 font-bold">
      <div className="flex flex-col items-center pt-20 gap-10">
        <p className="text-2xl">회원이 되신걸 축하합니다!</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label htmlFor="userNickName">별명</label>
          <input
            className="input input-bordered  w-full max-w-xs"
            type="text"
            id="userNickName"
            name="userNickName"
            value={formData.userNick}
            onChange={handleChange}
          />
          <label htmlFor="userIntroduce">자기소개</label>
          <textarea
            className="textarea textarea-bordered mb-3"
            type="text"
            id="userIntroduce"
            name="userIntroduce"
            value={formData.userIntroduce}
            onChange={handleChange}
          />
          <button>확인</button>
        </form>
      </div>
    </div>
  );
}
