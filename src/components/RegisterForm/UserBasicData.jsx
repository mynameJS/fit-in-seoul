import { useState, useEffect } from 'react';
import { userInputState } from '../../atom';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import {
  userEmailValidation,
  userPasswordValidation,
  userPasswordConfirm,
  checkDuplicateIdValidation,
} from './validation';
import { location } from '../../constant/constant';

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   width: 20%;
//   margin: 5% auto;
// `;

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
    <div className="bg-sky-100 h-screen text-slate-500 font-bold flex flex-col items-center pt-10  gap-10">
      <p className="text-4xl">회원가입</p>
      <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
        {!isGoogle && (
          <>
            <label htmlFor="userEmail">E-mail </label>
            <input
              className="input input-bordered  w-full max-w-xs"
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
            />
            <button className="mt-2 mb-2" type="button" onClick={handleCheckDuplicateIdClick}>
              E-mail 중복검사
            </button>
            <label htmlFor="userPassword">Password </label>
            <input
              className="input input-bordered  w-full max-w-xs"
              type="password"
              id="userPassword"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
            />
            <label className="mt-2" htmlFor="userPasswordValid">
              Password Verification
            </label>
            <input
              className="input input-bordered  w-full max-w-xs"
              type="password"
              id="userPasswordValid"
              name="userPasswordValid"
              value={formData.userPasswordValid}
              onChange={handleChange}
            />
          </>
        )}
        <label className="mt-2" htmlFor="userName">
          이름{' '}
        </label>
        <input
          className="input input-bordered  w-full max-w-xs"
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <div className="flex items-center justify-center gap-4 mt-2">
          <label htmlFor="male">남 </label>
          <input
            className="radio checked:bg-slate-500"
            type="radio"
            id="male"
            name="gender"
            value="male"
            checked={formData.gender === 'male'}
            onChange={handleChange}
          />
          <label htmlFor="female">여 </label>
          <input
            className="radio checked:bg-slate-500"
            type="radio"
            id="female"
            name="gender"
            value="female"
            checked={formData.gender === 'female'}
            onChange={handleChange}
          />
        </div>
        <label className="mt-2" htmlFor="residence">
          거주지{' '}
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          id="residence"
          name="residence"
          value={formData.residence}
          onChange={handleChange}>
          <option value="구를 선택해주세요">구를 선택해주세요</option>
          {location.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="flex justify-between mt-3">
          <button className="disabled:opacity-50" type="submit" disabled={isConfirm}>
            가입하기
          </button>
          <button
            onClick={() => {
              navigate('/login');
            }}>
            가입취소
          </button>
        </div>
      </form>
    </div>
  );
}
