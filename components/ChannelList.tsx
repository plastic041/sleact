import { IChannel, IUser } from "@typings/db";

import { FC } from "react";
import { NavLink } from "react-router-dom";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import useSWR from "swr";

const ChannelList: FC = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser>("/api/users", fetcher);
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );

  return (
    <ul className="flex flex-col p-2">
      {channelData?.map((channel: IChannel) => (
        <NavLink
          key={channel.name}
          to={`/workspace/${workspace}/channel/${channel.name}`}
          activeClassName="font-bold"
          className="hover:underline font-light"
        >
          <span># {channel.name}</span>
        </NavLink>
      ))}
    </ul>
  );
};

export default ChannelList;
