import * as Joi from "@hapi/joi";
import * as path from "path";
import { IRoute, IRouter } from "../interfaces/common.interface";
import { IFileController } from "../interfaces/file.interface";
import { removedFileSchema, uploadedFileSchema } from "../schemas";

export class FileRouter implements IRouter {
  private routes: IRoute[];
  private apiVersion: string = "/v1";

  constructor(private fileController: IFileController) {
    this.setupRouter();
  }

  public getRoutes(): IRoute[] {
    return this.routes;
  }

  private getValidateRules(...fields) {
    const validateFields = {
      file: Joi.any().meta({ swaggerType: "file" }),
      filename: Joi.string()
    };

    return fields.reduce(
      (acc, { name, required = false, description = "" }) => ({
        [name]: required
          ? validateFields[name].required().description(description || name)
          : validateFields[name].description(description || name),
        ...acc
      }),
      {}
    );
  }

  private setupRouter() {
    this.routes = [
      {
        method: "POST",
        path: this.apiVersion + "/files",
        options: {
          handler: this.fileController.uploadFile.bind(this.fileController),
          payload: {
            maxBytes: 1024 * 1024 * 10,
            output: "stream",
            allow: "multipart/form-data",
            parse: true
          },
          validate: {
            payload: this.getValidateRules({
              name: "file",
              required: true,
              description: "Download file"
            })
          },
          description: "Upload files",
          notes: "Returns the path to the downloaded file",
          tags: ["api", "files"],
          plugins: {
            "hapi-swagger": {
              payloadType: "form",
              responses: {
                201: {
                  description: "Information about the uploaded file",
                  schema: uploadedFileSchema
                },
                400: {
                  description: "Validation failed."
                },
                403: {
                  description: "Authorization required."
                }
              }
            }
          }
        }
      },
      {
        method: "DELETE",
        path: this.apiVersion + "/files/{filename}",
        options: {
          handler: this.fileController.removeFile.bind(this.fileController),
          validate: {
            params: this.getValidateRules({
              name: "filename",
              required: true,
              description: "File name"
            })
          },
          description: "Remove file",
          notes: "Returns the path to the removed file",
          tags: ["api", "files"],
          plugins: {
            "hapi-swagger": {
              responses: {
                200: {
                  description: "Removed file name",
                  schema: removedFileSchema
                },
                204: {
                  description: "No content"
                },
                403: {
                  description: "Authorization required."
                }
              }
            }
          }
        }
      },
      {
        method: "GET",
        path: "/upload/{file*}",
        handler: {
          directory: {
            path: path.join(__dirname, "..", "..", "upload")
          }
        },
        options: {
          auth: false
        }
      }
    ];
  }
}
