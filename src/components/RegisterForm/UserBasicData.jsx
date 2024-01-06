import { styled } from 'styled-components';
import { useState } from 'react';
import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 20%;
  margin: 5% auto;
`;

export default function UserBasicData() {
  const [formData, setFormData] = useState({
    userId: '',
    userPassword: '',
    userPasswordValid: '',
    userName: '',
    gender: '',
    residence: '',
  });

  const [userInput, setUserInput] = useRecoilState(userInputState);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.userPassword !== formData.userPasswordValid) {
      alert('비밀번호 확인을 다시 해주세요. 두 값이 일치하지 않습니다.');
      return;
    }
    // userPasswordValid 프로퍼티를 제외한 나머지 formData를 생성
    const { userPasswordValid, ...formDataToStore } = formData;

    // Recoil 상태로 나머지 formData를 업데이트
    setUserInput(formDataToStore);
  };

  return (
    <Form onSubmit={handleSubmit} method="post">
      <label htmlFor="userId">아이디 </label>
      <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} />
      <label htmlFor="userPassword">비밀번호 </label>
      <input
        type="password"
        id="userPassword"
        name="userPassword"
        value={formData.userPassword}
        onChange={handleChange}
      />
      <label htmlFor="userPasswordValid">비밀번호 확인 </label>
      <input
        type="password"
        id="userPasswordValid"
        name="userPasswordValid"
        value={formData.userPasswordValid}
        onChange={handleChange}
      />
      <label htmlFor="userName">이름 </label>
      <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} />
      <label htmlFor="male">남 </label>
      <input
        type="radio"
        id="male"
        name="gender"
        value="male"
        checked={formData.gender === 'male'}
        onChange={handleChange}
      />
      <label htmlFor="female">여 </label>
      <input
        type="radio"
        id="female"
        name="gender"
        value="female"
        checked={formData.gender === 'female'}
        onChange={handleChange}
      />
      <label htmlFor="residence">거주지 </label>
      <select id="residence" name="residence" value={formData.residence} onChange={handleChange}>
        <option value="">구를 선택해주세요</option>
        <option value="강남구">강남구</option>
        <option value="강동구">강동구</option>
        <option value="강북구">강북구</option>
        <option value="강서구">강서구</option>
        <option value="관악구">관악구</option>
        <option value="광진구">광진구</option>
        <option value="구로구">구로구</option>
        <option value="금천구">금천구</option>
        <option value="노원구">노원구</option>
        <option value="도봉구">도봉구</option>
        <option value="동대문구">동대문구</option>
        <option value="동작구">동작구</option>
        <option value="마포구">마포구</option>
        <option value="서대문구">서대문구</option>
        <option value="서초구">서초구</option>
        <option value="성동구">성동구</option>
        <option value="성북구">성북구</option>
        <option value="송파구">송파구</option>
        <option value="양천구">양천구</option>
        <option value="영등포구">영등포구</option>
        <option value="용산구">용산구</option>
        <option value="은평구">은평구</option>
        <option value="종로구">종로구</option>
        <option value="중구">중구</option>
        <option value="중랑구">중랑구</option>
      </select>
      <button type="submit">가입하기</button>
      <button type="submit">취 소</button>
    </Form>
  );
}
