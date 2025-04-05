export class CreatePersonalGroupDto {
  readonly users: string[];
  readonly userNames: string[];
}

export class SetLastMessageDto {
  readonly groupId: string;
  readonly messageId: string;
}

export class CreateGroupDto {
  readonly users: string[];
  readonly userNames: string[];
  readonly name: string;
}