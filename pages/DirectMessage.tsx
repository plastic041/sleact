import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { IDM, IUser } from "@typings/db";

import Avatar from "boring-avatars";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import Scrollbars from "react-custom-scrollbars-2";
import axios from "axios";
import fetcher from "@utils/fetcher";
import makeSection from "@utils/makeSection";
import useInput from "@hooks/useInput";
import { useParams } from "react-router";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const DirectMessage: FC = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser>(
    `/api/workspaces/${workspace}/users/${id}`,
    fetcher
  );
  const { data: myData } = useSWR("/api/users", fetcher);

  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index: number) =>
      `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${
        index + 1
      }`,
    fetcher
  );
  const isEmpty: boolean = chatData?.[0]?.length === 0;
  const isReachingEnd: boolean =
    isEmpty ||
    (chatData && chatData[chatData.length - 1]?.length < 20) ||
    false;

  const [chat, onChangeChat, setChat] = useInput("");
  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
            setChat("");
          })
          .catch((error) => console.error(error));
      }
    },
    [chat]
  );

  if (!userData || !myData) return null;

  const chatSections = makeSection(
    chatData ? [...chatData.flat()].reverse() : []
  );

  return (
    <>
      <div
        id="header"
        className="border-b flex flex-row items-center space-x-4 p-2"
      >
        <Avatar size={32} name={userData.nickname} variant="beam"></Avatar>
        <span>{userData.nickname}</span>
      </div>
      <div id="chat" className="flex flex-col flex-1">
        <ChatList
          chatSections={chatSections}
          ref={scrollbarRef}
          setSize={setSize}
          isEmpty={isEmpty}
          isReachingEnd={isReachingEnd}
        />
        <ChatBox
          chat={chat}
          onChangeChat={onChangeChat}
          onSubmitForm={onSubmitForm}
        />
      </div>
    </>
  );
};
export default DirectMessage;
