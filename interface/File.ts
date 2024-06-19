import { Stream } from "stream";

export interface Upload {
  filename: String;
  mimetype: String;
  encoding: String;
  createReadStream: () => Stream;
}
