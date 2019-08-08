import { Request, ResponseToolkit } from "@hapi/hapi";
import { IFileController, IFileService } from "../interfaces/file.interface";

export class FileController implements IFileController {
  constructor(public fileService: IFileService) {}

  public async uploadFile(req: Request, h: ResponseToolkit) {
    try {
      const file = await this.fileService.saveFile(req.payload);
      return h.response(file).code(201);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  public async removeFile(req: Request, h: ResponseToolkit) {
    try {
      const deletedFile = await this.fileService.removeFile(
        req.params.filename
      );
      if (!deletedFile) {
        return h.response().code(204);
      }
      return h.response(deletedFile).code(200);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
