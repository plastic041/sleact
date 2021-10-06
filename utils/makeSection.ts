import { IDM } from "@typings/db";
import dayjs from "dayjs";

const makeSection = (chatList: IDM[]) => {
  const sections: { [key: string]: IDM[] } = {};
  chatList.forEach((chat) => {
    const date = dayjs(chat.createdAt).format("YYYY-MM-DD");
    if (Array.isArray(sections[date])) {
      sections[date].push(chat);
    } else {
      sections[date] = [chat];
    }
  });
  return sections;
};

export default makeSection;
