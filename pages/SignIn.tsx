import { Link, Redirect } from "react-router-dom";
import { useCallback, useState } from "react";

import axios from "axios";
import fetcher from "@utils/fetcher";
import useInput from "@hooks/useInput";
import useSWR from "swr";

const SignIn = () => {
  const { data, error, mutate } = useSWR("/api/users", fetcher);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [isSignInError, setIsSignInError] = useState(false);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setIsSignInError(false);
      axios
        .post(
          "/api/users/login",
          { email, password },
          { withCredentials: true }
        )
        .then((response) => {
          mutate(response.data);
        })
        .catch((error) =>
          setIsSignInError(error.response?.data?.statusCode === 401)
        );
    },
    [email, password]
  );

  if (data === undefined) return <div>불러오는 중…</div>;
  if (data) return <Redirect to="/workspace/sleact/channel/일반" />;

  return (
    <div className="w-96 mx-auto">
      <header className="header">Sleact</header>
      <div>
        <form className="mx-auto flex flex-col mb-4" onSubmit={onSubmit}>
          <label htmlFor="" className="form-label">
            <span className="form-label-span">이메일</span>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={onChangeEmail}
            />
          </label>
          <label htmlFor="" className="form-label">
            <span className="form-label-span">비밀번호</span>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={onChangePassword}
            />
          </label>
          <button className="form-button" type="submit">
            로그인
          </button>
        </form>
        <p className="text-sm text-gray-500">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-bold hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
