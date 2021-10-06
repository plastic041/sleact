import { FC, useCallback } from "react";

import { X } from "react-feather";

type Props = {
  show: boolean;
  onCloseModal: () => void;
};

const Modal: FC<Props> = ({ children, show, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-700 bg-opacity-50"
      onClick={onCloseModal}
    >
      <div
        className="absolute z-10 inline-block w-80 h-96 inset-0 mx-auto my-auto bg-white text-gray-900 text-center rounded shadow-lg p-2"
        onClick={stopPropagation}
      >
        <X className="ml-auto cursor-pointer" onClick={onCloseModal} />
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
