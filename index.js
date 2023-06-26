import "dotenv/config";
import linebot from "linebot";
import axios from "axios";
import fs from "fs";

const options = {
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ODM1Njc0ZWEwMmU4MmFlZmY1MDVlZGI4MWIyNThlMiIsInN1YiI6IjY0NTM2MmUxYzA0NDI5MDEyMmNiY2RmZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OGOyotzLJEplT-ycamW_v4D9GcjGiQH0MkfppH3ypwo",
  },
};

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});
// const movieTitle = ''

bot.on("message", async (event) => {
  // event.message.text = '星際異攻'
  if (event.message.type === "text") {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?language=zh-TW&query=${event.message.text}`,
        options
      );
      const arr = [];

      data.results.forEach((item, i) => {
        if (i >= 4) return false;
        arr.push({
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "image",
                    url:
                      "https://image.tmdb.org/t/p/w780/" +
                      `${item.backdrop_path}`,
                    size: "3xl",
                    aspectMode: "cover",
                    aspectRatio: "150:196",
                    gravity: "center",
                    flex: 1,
                  },
                ],
              },
            ],
            paddingAll: "0px",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        contents: [],
                        size: "xl",
                        wrap: true,
                        text: `${item.title}`,
                        color: "#ffffff",
                        weight: "bold",
                        align: "center",
                      },
                      {
                        type: "text",
                        text: `${item.release_date}`,
                        color: "#ffffffcc",
                        size: "sm",
                      },
                    ],
                    spacing: "sm",
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [
                          {
                            type: "text",
                            contents: [],
                            size: "sm",
                            wrap: true,
                            margin: "lg",
                            color: "#ffffffde",
                            text: `${item.overview}`,
                          },
                        ],
                      },
                    ],
                    paddingAll: "13px",
                    backgroundColor: "#ffffff1A",
                    cornerRadius: "2px",
                    margin: "xl",
                  },
                ],
              },
            ],
            paddingAll: "20px",
            backgroundColor: "#464F69",
          },
        });
      });
      arr.sort((a, b) => {
        return (
          new Date(b.body.contents[0].contents[0].contents[1].text).getTime() -
          new Date(a.body.contents[0].contents[0].contents[1].text).getTime()
        );
      });
      event.reply({
        type: "flex",
        altText: "電影查詢",
        contents: {
          type: "carousel",
          contents: arr,
        },
      });
    } catch (error) {
      console.log(error);
      event.reply("格式錯誤");
    }
  }
});

bot.listen("/", process.env.PORT || 3000, () => {
  console.log("機器人啟動");
});
