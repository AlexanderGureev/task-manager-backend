import * as fs from "fs";
import * as path from "path";
import { IConfig } from "../interfaces/common.interface";
import { IFileService } from "../interfaces/file.interface";

export class FileService implements IFileService {
  constructor(private config: IConfig) {}

  public async saveFile({ file }) {
    const { filename } = file.hapi;

    const fName =
      path.basename(filename, path.extname(filename)) +
      "-" +
      Date.now() +
      path.extname(filename);

    await fs.promises.writeFile(
      path.join(this.config.PUBLIC_DIR, fName),
      file._data
    );

    return {
      originalFilename: filename,
      filename: fName,
      path: `/upload/${fName}`
    };
  }

  public async removeFile(fileName) {
    const files = await fs.promises.readdir(this.config.PUBLIC_DIR);
    if (fileName === "ava_default.png" || !files.includes(fileName)) {
      return;
    }
    await fs.promises.unlink(path.join(this.config.PUBLIC_DIR, fileName));
    return { filename: fileName };
  }
}
