import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { userInputLoginData } from '../atom';
import { useRecoilState } from 'recoil';
import { loginConfirmValidation } from './RegisterForm/validation';
import { useNavigate } from 'react-router-dom';

const LoginFormContainer = styled.div`
  width: 40%;
  border: 1px solid black;
  padding: 10px;
  margin: 20% auto;

  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const LoginFormTag = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function LoginForm() {
  const navigate = useNavigate();
  const [userInputLogin, setUserInputLogin] = useRecoilState(userInputLoginData);
  const [formData, setFormData] = useState({
    userInputId: '',
    userInputPassword: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const [targetData, result] = await loginConfirmValidation(formData);

    if (result === 2) {
      alert('회원정보가 일치합니다');
      setUserInputLogin({ ...targetData });
      navigate('/home');
      console.log(userInputLogin);
      return;
    }
    if (result === 1) {
      alert('비밀번호가 틀립니다');
      return;
    }

    if (!result) {
      alert('아이디가 존재하지 않습니다');
    }
  };

  return (
    <LoginFormContainer>
      <LoginFormTag onSubmit={handleSubmit} method="post">
        <label htmlFor="userInputId">아이디</label>
        <input type="text" id="userInputId" name="userInputId" value={formData.userInputId} onChange={handleChange} />
        <label htmlFor="userInputPassword">비밀번호</label>
        <input
          type="password"
          id="userInputPassword"
          name="userInputPassword"
          value={formData.userInputPassword}
          onChange={handleChange}
        />
        <button>로그인</button>
      </LoginFormTag>
      <Link to={'/register_basic'}>
        <p>회원가입</p>
      </Link>
      <p>소셜로그인</p>
      <Link to={'/'}>
        <p>홈으로</p>
      </Link>
    </LoginFormContainer>
  );
}
