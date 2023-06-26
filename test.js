import aaa from "./aaa.js";
import fs from "fs";

const sorted = aaa.sort((a, b) => {
  return (
    new Date(a.body.contents[0].contents[0].contents[1].text).getTime() -
    new Date(b.body.contents[0].contents[0].contents[1].text).getTime()
  );
});

fs.writeFileSync("bbb.json", JSON.stringify(sorted, null, 2));
