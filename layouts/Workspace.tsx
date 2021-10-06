import { FC, useCallback, useEffect, useState } from "react";
import { IChannel, IUser } from "@typings/db";
import { Redirect, Route, Switch, useParams } from "react-router";

import Avatar from "boring-avatars";
import Channel from "@pages/Channel";
import ChannelList from "@components/ChannelList";
import CreateChannelModal from "@components/CreateChannelModal";
import CreateWorkspaceModal from "@components/CreateWorkspaceModal";
import DMList from "@components/DMList";
import DirectMessage from "@pages/DirectMessage";
import InviteChannelModal from "@components/InviteChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import { Link } from "react-router-dom";
import Menu from "@components/Menu";
import { Plus } from "react-feather";
import axios from "axios";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import useSocket from "@hooks/useSocket";

const Workspace: FC = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>("/api/users", fetcher);
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );
  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      socket.emit("login", {
        id: userData.id,
        channels: channelData.map((c) => c.id),
      });
    }
  }, [channelData, userData, socket]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);

  const [isShowUserMenu, setIsShowUserMenu] = useState(false);

  const [isShowWorkspaceModal, setIsShowWorkspaceModal] = useState(false);
  const [isShowCreateWorkspaceModal, setIsShowCreateWorkspaceModal] =
    useState(false);
  const [isShowCreateChannelModal, setIsShowCreateChannelModal] =
    useState(false);
  const [isShowInviteWorkspaceModal, setIsShowInviteWorkspaceModal] =
    useState(false);
  const [isShowInviteChannelModal, setIsShowInviteChannelModal] =
    useState(false);

  const onSignout = useCallback(() => {
    axios
      .post("/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false);
      });
  }, []);

  const toggleUserProfile = useCallback(() => {
    setIsShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setIsShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsShowCreateWorkspaceModal(false);
    setIsShowCreateChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setIsShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setIsShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setIsShowInviteWorkspaceModal(true);
  }, []);

  if (!userData) return <Redirect to="/signin" />;

  return (
    <div className="h-screen flex flex-col">
      <header className="">
        <nav className="w-full flex flex-row justify-between items-center bg-gray-800 p-2 text-white border-b border-gray-500">
          <h1>Workspace</h1>
          <div
            className="space-x-2 flex flex-row items-center"
            onClick={toggleUserProfile}
          >
            <div className="cursor-pointer">
              <Avatar
                size={24}
                name={userData.nickname}
                variant="beam"
              ></Avatar>
            </div>
          </div>
          <Menu
            onCloseModal={toggleUserProfile}
            show={isShowUserMenu}
            style={{ right: "12px", top: "48px", width: "200px" }}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-2 border-b border-gray-400 pb-4">
                <Avatar
                  size={40}
                  name={userData.nickname}
                  variant="beam"
                ></Avatar>
                <div className="flex flex-col items-start">
                  <span id="profile-name" className="font-bold">
                    {userData.nickname}
                  </span>
                  <span
                    id="profile-active"
                    className="text-center text-sm px-4 bg-green-500 rounded-full text-white"
                  >
                    접속 중
                  </span>
                </div>
              </div>
              <button onClick={onSignout}>로그아웃</button>
            </div>
          </Menu>
        </nav>
      </header>
      <div className="flex flex-1">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white w-64 flex flex-row">
          <ul className="p-2 border-r border-gray-500 flex flex-col items-center space-y-2">
            {userData?.Workspaces?.map((ws) => {
              return (
                <li key={ws.id}>
                  <Link to={`/workspace/${ws.url}/channel/일반`}>
                    <span className="w-8 h-8 flex justify-center items-center text-xl bg-white text-gray-900 font-bold rounded hover:rounded-3xl transition-all duration-150">
                      {ws.name[0].toUpperCase()}
                    </span>
                  </Link>
                </li>
              );
            })}
            <button onClick={onClickCreateWorkspace}>
              <Plus />
            </button>
          </ul>
          <div className="flex flex-col flex-1">
            <div
              className="border-b border-gray-500 h-12 flex justify-center items-center cursor-pointer"
              onClick={toggleWorkspaceModal}
            >
              <h1 className="text-2xl font-bold cursor-pointer">일반</h1>
            </div>
            <Menu
              show={isShowWorkspaceModal}
              onCloseModal={toggleWorkspaceModal}
              style={{ top: "95px", left: "80px" }}
            >
              <button
                onClick={onClickInviteWorkspace}
                className="hover:underline"
              >
                워크스페이스에 사용자 초대
              </button>
              <button onClick={onClickAddChannel} className="hover:underline">
                채널 추가
              </button>
            </Menu>
            <ChannelList />
            <DMList />
          </div>
        </div>
        <main className="flex flex-1 flex-col">
          <Switch>
            <Route
              path="/workspace/:workspace/channel/:channel"
              component={Channel}
            />
            <Route
              path="/workspace/:workspace/dm/:id"
              component={DirectMessage}
            />
          </Switch>
        </main>
        <CreateWorkspaceModal
          show={isShowCreateWorkspaceModal}
          onCloseModal={onCloseModal}
          setIsShowCreateWorkspaceModal={setIsShowCreateWorkspaceModal}
        />
        <CreateChannelModal
          show={isShowCreateChannelModal}
          onCloseModal={onCloseModal}
          setIsShowCreateChannelModal={setIsShowCreateChannelModal}
        />
        <InviteWorkspaceModal
          show={isShowInviteWorkspaceModal}
          onCloseModal={onCloseModal}
          setIsShowInviteWorkspaceModal={setIsShowInviteWorkspaceModal}
        />
        <InviteChannelModal
          show={isShowInviteChannelModal}
          onCloseModal={onCloseModal}
          setIsShowInviteChannelModal={setIsShowInviteChannelModal}
        />
      </div>
    </div>
  );
};

export default Workspace;
