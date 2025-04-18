import { FileDto } from "src/files/files.dto";

export class CreateMessageDto {
  readonly content: string;
  readonly senderId: string;
  readonly senderName: string;
  readonly groupId: string;
  readonly files: Array<FileDto>;
}
