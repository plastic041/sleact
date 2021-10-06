import { FC, useCallback } from "react";

import { IUser } from "@typings/db";
import Modal from "@components/Modal";
import axios from "axios";
import fetcher from "@utils/fetcher";
import useInput from "@hooks/useInput";
import useSWR from "swr";

type Props = {
  show: boolean;
  onCloseModal: () => void;
  setIsShowCreateWorkspaceModal: (isShow: boolean) => void;
};

const CreateWorkspaceModal: FC<Props> = ({
  show,
  onCloseModal,
  setIsShowCreateWorkspaceModal,
}) => {
  const { mutate } = useSWR<IUser | false>("/api/users", fetcher);

  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput("");
  const [newURL, onChangeNewURL, setNewURL] = useInput("");

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newURL || !newURL.trim()) return;
      axios
        .post(
          "/api/workspaces",
          {
            workspace: newWorkspace,
            url: newURL,
          },
          { withCredentials: true }
        )
        .then(() => {
          mutate();
          setIsShowCreateWorkspaceModal(false);
          setNewWorkspace("");
          setNewURL("");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [newWorkspace, newURL]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <h2 className="text-center text-xl font-bold mb-8">워크스페이스 생성</h2>
      <form onSubmit={onCreateWorkspace} className="flex flex-col">
        <label className="text-left text-gray-500 space-y-2 mb-4">
          <span>워크스페이스 이름</span>
          <input
            type="text"
            className="border border-gray-500 focus:ring focus:ring-gray-300 rounded w-full transition duration-75 text-gray-900 p-2 focus:outline-none"
            value={newWorkspace}
            onChange={onChangeNewWorkspace}
          ></input>
        </label>
        <label className="text-left text-gray-500 space-y-2 mb-4">
          <span>워크스페이스 주소</span>
          <input
            type="text"
            className="border border-gray-500 focus:ring focus:ring-gray-300 rounded w-full transition duration-75 text-gray-900 p-2 focus:outline-none"
            value={newURL}
            onChange={onChangeNewURL}
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

export default CreateWorkspaceModal;
