import { styled } from 'styled-components';
import { useState } from 'react';
import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';
import { userNickNameValidation } from './validation';
import { addData } from '../../config/firebase.js';
import { useNavigate } from 'react-router-dom';

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 30% auto;
`;

const UserProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 20%;
  border: 1px solid black;
  padding: 10px;
`;

export default function UserProfileData() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useRecoilState(userInputState);
  const [formData, setFormData] = useState({
    userNickName: '',
    userIntroduce: '',
  });

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
      addData(updatedUserInput);
      console.log(updatedUserInput);
      return updatedUserInput;
    });
    alert('회원가입이 완료되었습니다');
    navigate('/login');
  };

  return (
    <UserProfileContainer>
      <p>회원이 되신걸 축하합니다!</p>
      <UserProfileForm onSubmit={handleSubmit} method="post">
        <label htmlFor="userNickName">닉네임</label>
        <input type="text" id="userNickName" name="userNickName" value={formData.userNick} onChange={handleChange} />
        <label htmlFor="userIntroduce">자기소개</label>
        <textarea
          type="text"
          id="userIntroduce"
          name="userIntroduce"
          value={formData.userIntroduce}
          onChange={handleChange}
        />
        <button>확인</button>
      </UserProfileForm>
    </UserProfileContainer>
  );
}
