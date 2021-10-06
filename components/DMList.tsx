import { FC, useEffect, useState } from "react";
import { IUser, IUserWithOnline } from "@typings/db";

import { NavLink } from "react-router-dom";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import useSWR from "swr";
import useSocket from "@hooks/useSocket";

const DMList: FC = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser>("/api/users", fetcher);
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );

  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState<boolean>(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  useEffect(() => {
    socket?.on("onlineList", (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off("onlineList");
    };
  }, [socket]);

  return (
    <ul className="flex flex-col p-2">
      {memberData?.map((member: IUser) => {
        const isOnline = onlineList.includes(member.id);
        return (
          <NavLink
            key={member.id}
            to={`/workspace/${workspace}/dm/${member.id}`}
            activeClassName="font-bold"
            className="hover:underline font-light gap-1 flex"
          >
            <span
              className={`font-mono ${isOnline ? "bg-green-500 rounded" : ""}`}
            >
              {isOnline ? "@" : "#"}
            </span>
            <span>{member.nickname}</span>
            {member.id === userData?.id && <span className="italic">(나)</span>}
          </NavLink>
        );
      })}
    </ul>
  );
};

export default DMList;
