import { styled } from 'styled-components';
import { useState } from 'react';
import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';
import { userNickNameValidation } from './validation';

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
  const [userInput, setUserInput] = useRecoilState(userInputState);
  const [formData, setFormData] = useState({
    userNickName: '',
    userAboutMe: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!userNickNameValidation(formData.userNickName)) {
      alert('닉네임은 8자 이하에 특수문자나 공백이 포함될 수 없습니다.');
      return;
    }
    setUserInput({ ...userInput, ...formData });
    console.log(userInput);
  };

  return (
    <UserProfileContainer>
      <p>회원이 되신걸 축하합니다!</p>
      <UserProfileForm onSubmit={handleSubmit} method="post">
        <label htmlFor="userNickName">닉네임</label>
        <input type="text" id="userNickName" name="userNickName" value={formData.userNick} onChange={handleChange} />
        <label htmlFor="userAboutMe">자기소개</label>
        <textarea
          type="text"
          id="userAboutMe"
          name="userAboutMe"
          value={formData.userAboutMe}
          onChange={handleChange}
        />
        <button>확인</button>
      </UserProfileForm>
    </UserProfileContainer>
  );
}
