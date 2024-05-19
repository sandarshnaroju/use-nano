import https from "https";
import * as fs from "fs";

export function downloadFileWithCallback(
  url: string,
  path: string,
  callback: (string) => void
): void {
  const file = fs.createWriteStream(path);
  https
    .get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close(callback);
      });
    })
    .on("error", function (err) {
      fs.unlink(path, () => {});
      if (callback) callback(err.message);
    });
}
