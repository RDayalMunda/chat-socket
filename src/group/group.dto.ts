export class CreatePersonalGroupDto {
  readonly users: string[];
  readonly userNames: string[];
}

export class SetLastMessageDto {
  readonly groupId: string;
  readonly messageId: string;
}

