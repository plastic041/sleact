import { FC, useCallback } from "react";

import axios from "axios";
import fetcher from "../utils/fetcher";
import useSWR from "swr";

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR("/api/users", fetcher);
  const onSignout = useCallback(() => {
    axios
      .post("/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
      });
  }, []);
  return (
    <div>
      <h1>Workspace</h1>
      <button onClick={onSignout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
