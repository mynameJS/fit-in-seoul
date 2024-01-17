import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import {
  userEmailValidation,
  userPasswordValidation,
  userPasswordConfirm,
  checkDuplicateIdValidation,
} from './validation';
import { location } from '../../constant/constant';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 20%;
  margin: 5% auto;
`;

export default function UserBasicData() {
  const navigate = useNavigate();
  // 구글 로그인 확인
  const [userInput, setUserInput] = useRecoilState(userInputState);
  const [isConfirm, setIsConfirm] = useState(true);
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
    userPasswordValid: '',
    userName: '',
    gender: '',
    residence: '',
  });

  const isGoogle = auth.currentUser?.providerData[0]?.providerId === 'google.com';

  useEffect(() => {
    if (toggleIsConfirmState()) {
      setIsConfirm(true);
    } else {
      setIsConfirm(false);
    }
  }, [formData]);

  useEffect(() => {
    if (isGoogle) {
      const googleUserInfo = {
        userEmail: auth.currentUser.email,
        userPassword: null,
        userPasswordValid: null,
      };
      setFormData({
        ...formData,
        ...googleUserInfo,
      });
    }
  }, []);

  const toggleIsConfirmState = () => {
    const inputValues = Object.values(formData);
    // 입력값이 하나라도 빈값이면 ? true 반환
    return inputValues.some(value => value === '');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!isGoogle) {
      if (!userPasswordValidation(formData.userPassword)) {
        alert('비밀번호는 8자리 이상이며 공백이 포함되지 않아야 합니다.');
        return;
      }
      if (!userPasswordConfirm(formData.userPassword, formData.userPasswordValid)) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
    }
    // userPasswordValid 프로퍼티를 제외한 나머지 formData를 생성
    const { userPasswordValid, ...formDataToStore } = formData;

    // Recoil 상태로 나머지 formData를 업데이트
    setUserInput(formDataToStore);
    navigate('/register_interest');
  };

  const handleCheckDuplicateIdClick = async () => {
    const result = await checkDuplicateIdValidation(formData.userEmail);
    // 이메일 유효성검사
    if (!userEmailValidation(formData.userEmail)) {
      alert('유효하지 않은 이메일 형식입니다.');
      return;
    }
    // 중복검사
    if (result) {
      alert('이미 등록된 이메일 입니다..');
      return;
    }
    alert('사용하실 수 있는 이메일 입니다.');
  };

  return (
    <Form onSubmit={handleSubmit} method="post">
      {!isGoogle && (
        <>
          <label htmlFor="userEmail">이메일 </label>
          <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleChange} />
          <button type="button" onClick={handleCheckDuplicateIdClick}>
            중복검사
          </button>
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
        </>
      )}
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
        {location.map(item => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isConfirm}>
        가입하기
      </button>
      <Link to={'/login'}>취소</Link>
    </Form>
  );
}
