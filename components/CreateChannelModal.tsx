import { FC, useCallback } from "react";
import { IChannel, IUser } from "@typings/db";

import Modal from "@components/Modal";
import axios from "axios";
import fetcher from "@utils/fetcher";
import useInput from "@hooks/useInput";
import { useParams } from "react-router";
import useSWR from "swr";

type Props = {
  show: boolean;
  onCloseModal: () => void;
  setIsShowCreateChannelModal: (isShow: boolean) => void;
};

const CreateChannelModal: FC<Props> = ({
  show,
  onCloseModal,
  setIsShowCreateChannelModal,
}) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");
  const { workspace, channel } =
    useParams<{ workspace: string; channel: string }>();
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher);
  const { data: channelData, mutate } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          mutate();
          setIsShowCreateChannelModal(false);
          setNewChannel("");
        })
        .catch((error) => console.dir(error.response?.data));
    },
    [newChannel]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <h2 className="text-center text-xl font-bold mb-8">채널 생성</h2>
      <form onSubmit={onCreateChannel} className="flex flex-col">
        <label className="text-left text-gray-500 space-y-2 mb-4">
          <span>채널 이름</span>
          <input
            type="text"
            className="border border-gray-500 focus:ring focus:ring-gray-300 rounded w-full transition duration-75 text-gray-900 p-2 focus:outline-none"
            value={newChannel}
            onChange={onChangeNewChannel}
          ></input>
        </label>
        <button
          type="submit"
          className="bg-gray-700 text-xl text-white font-bold py-2 px-4 rounded focus:ring focus:ring-gray-500 focus:outline-none"
        >
          생성
        </button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
