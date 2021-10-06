import { ChangeEvent, FC, FormEvent, ReactNode, useCallback } from "react";
import { IUser, IUserWithOnline } from "@typings/db";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";

import Avatar from "boring-avatars";
import { Send } from "react-feather";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import useSWR from "swr";

type Props = {
  chat: string;
  onSubmitForm: (e: FormEvent<HTMLFormElement>) => void;
  onChangeChat: (e: any) => void;
};

const ChatBox: FC<Props> = ({ chat, onSubmitForm, onChangeChat }) => {
  const onKeydownChat = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm]
  );
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>("/api/users", fetcher);
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focused: boolean
    ): ReactNode => {
      if (!memberData) return;
      return (
        <button className={`${focused ? "bg-gray-200" : "bg-white"}`}>
          <Avatar
            name={memberData[index].email}
            size="20"
            variant="beam"
          ></Avatar>
          <span>{highlightedDisplay}</span>
        </button>
      );
    },
    [memberData]
  );

  return (
    <div>
      <form
        className="flex flex-row flex-1 m-2 space-x-2"
        onSubmit={onSubmitForm}
      >
        <MentionsInput
          className="border border-gray-500 rounded flex flex-1"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          allowSuggestionsAboveCursor
        >
          <Mention
            className="divider"
            appendSpaceOnAdd
            trigger="@"
            data={
              memberData?.map((user) => ({
                id: user.id,
                display: user.nickname,
              })) || []
            }
            renderSuggestion={renderSuggestion}
          />
        </MentionsInput>
        <button
          type="submit"
          className="text-blue-500 hover:text-blue-300 disabled:text-gray-500 transition-colors duration-200 cursor-pointer disabled:cursor-default"
          disabled={!chat}
        >
          <Send aria-describedby="Send" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
