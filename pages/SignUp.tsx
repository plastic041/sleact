import { Link, Redirect } from "react-router-dom";
import React, { useCallback, useState } from "react";

import axios from "axios";
import fetcher from "@utils/fetcher";
import useInput from "@hooks/useInput";
import useSWR from "swr";

const SignUp = () => {
  const { data, error, mutate } = useSWR("/api/users", fetcher);

  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [isMatch, setisMatch] = useState(true);
  const [isSignUpError, setIsSignUpError] = useState("");
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setisMatch(e.target.value === passwordCheck);
    },
    [passwordCheck]
  );
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setisMatch(e.target.value === password);
    },
    [password]
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isMatch && nickname) {
        setIsSignUpError("");
        setIsSignUpSuccess(false);
        axios
          .post("/api/users", {
            email,
            nickname,
            password,
          })
          .then((response) => {
            setIsSignUpSuccess(true);
          })
          .catch((error) => {
            setIsSignUpError(error.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck]
  );

  if (data === undefined) return <div>불러오는 중…</div>;
  if (data) return <Redirect to="/workspace/sleact/channel/일반" />;

  return (
    <div className="w-96 mx-auto">
      <header className="header">Sleact</header>
      {isSignUpSuccess ? (
        <div className="mx-auto text-center">
          <h1 className="text-2xl mb-4">회원가입이 완료되었습니다</h1>
          <Link to="/signin">
            <button className="form-button">로그인 페이지로 이동</button>
          </Link>
        </div>
      ) : (
        <div>
          <form className="mx-auto flex flex-col mb-4" onSubmit={onSubmit}>
            <label className="form-label" id="email-label">
              <span className="form-label-span">이메일</span>
              <input
                type="email"
                id="email"
                className="form-input"
                name="email"
                value={email}
                onChange={onChangeEmail}
              />
              {isSignUpError && (
                <span className="form-error">이미 사용 중인 이메일입니다</span>
              )}
            </label>
            <label className="form-label" id="nickname-label">
              <span className="form-label-span">닉네임</span>
              <input
                type="text"
                id="text"
                className="form-input"
                name="text"
                value={nickname}
                onChange={onChangeNickname}
              />
              {!nickname && (
                <span className="form-error">닉네임을 입력해주세요</span>
              )}
            </label>
            <label className="form-label" id="password-label">
              <span className="form-label-span">비밀번호</span>
              <input
                type="password"
                id="password"
                className="form-input"
                name="password"
                value={password}
                onChange={onChangePassword}
              />
            </label>
            <label className="form-label" id="password-check-label">
              <span className="form-label-span">비밀번호 확인</span>
              <input
                type="password"
                id="password-check"
                className="form-input"
                name="password-check"
                value={passwordCheck}
                onChange={onChangePasswordCheck}
              />
              {!isMatch && (
                <span className="form-error">비밀번호가 일치하지 않습니다</span>
              )}
            </label>
            <button className="form-button" type="submit">
              회원가입
            </button>
          </form>
          <p className="text-sm text-gray-500">
            이미 회원이신가요?{" "}
            <Link
              to="/signin"
              className="text-blue-500 font-bold hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
