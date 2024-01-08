import { styled } from 'styled-components';
import { Link } from 'react-router-dom';

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

export default function LoginForm() {
  return (
    <LoginFormContainer>
      <p>아이디</p>
      <p>패스워드</p>
      <p>로그인</p>
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
