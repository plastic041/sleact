import { Link, useParams } from "react-router-dom";
import React, { FC, memo, useMemo } from "react";

import Avatar from "boring-avatars";
import { IDM } from "@typings/db";
import dayjs from "dayjs";
import regexifyString from "regexify-string";

type Props = {
  data: IDM;
};

const Chat: FC<Props> = memo(({ data }) => {
  const { workspace } = useParams<{ workspace: string }>();

  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[(.+?)\]\((\d+?)\)|\n/g,
        decorator: (match, index) => {
          const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link
                key={match + index}
                to={`/workspace/${workspace}/dm/${arr[2]}`}
                className="text-blue-500"
              >
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
      }),
    [data.content]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2">
        <Avatar name={data.Sender.email} size="36" variant="beam"></Avatar>
        <b>{data.Sender.nickname}</b>
        <span>{dayjs(data.createdAt).format("M월 d일 h:mm A")}</span>
      </div>
      <div className="flex flex-row">
        <span>{result}</span>
      </div>
    </div>
  );
});

export default Chat;
