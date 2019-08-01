import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

export interface IFileResponse {
  originalFilename?: string;
  filename?: string;
  path?: string;
}
export interface IFileController {
  uploadFile: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
  removeFile: (req: Request, h: ResponseToolkit) => Promise<ResponseObject>;
}

export interface IFileService {
  saveFile: (data: any) => Promise<IFileResponse>;
  removeFile: (filename: string) => Promise<IFileResponse>;
}
