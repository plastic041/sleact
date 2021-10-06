import { Scrollbars, positionValues } from "react-custom-scrollbars-2";
import { forwardRef, useCallback, useEffect } from "react";

import Chat from "@components/Chat";
import { IDM } from "@typings/db";

type Props = {
  chatSections?: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
};

const ChatList = forwardRef<Scrollbars, Props>(
  ({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
    const onScroll = useCallback((values: positionValues) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        console.log("a");
        setSize((prev: number) => prev + 1).then(() => {
          // 스크롤 위치 유지
        });
      }
    }, []);

    return (
      <div className="flex flex-1 w-full self-stretch p-4">
        <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
          <div className="flex flex-col">
            {chatSections &&
              Object.entries(chatSections).map(([date, chats]) => (
                <div key={date}>
                  <div className="sticky flex top-4 justify-center my-4">
                    <span className="text-gray-600 text-sm font-bold border rounded-full px-2 py-1 shadow">
                      {date}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {chats.map((chat) => (
                      <Chat key={chat.id} data={chat}>
                        {chat.content}
                      </Chat>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Scrollbars>
      </div>
    );
  }
);

export default ChatList;
