import { CSSProperties, FC, useCallback } from "react";

import { X } from "react-feather";

type Props = {
  children: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
  style: CSSProperties;
};

const Menu: FC<Props> = ({
  children,
  style,
  show,
  onCloseModal,
  closeButton,
}) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0" onClick={onCloseModal}>
      <div
        className="absolute flex flex-col bg-gray-100 text-gray-900 text-center rounded shadow-lg p-2"
        style={style}
        onClick={stopPropagation}
      >
        {closeButton && (
          <X className="ml-auto cursor-pointer" onClick={onCloseModal} />
        )}
        {children}
      </div>
    </div>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
