export interface IMessageDTO {
  value: string,
  createdAt: string,
  isSystem?: boolean,
  userId?: string, // not available for system messages
  userName?: string, // not available for system messages
}

export interface IMessage extends IMessageDTO {
  type: MessageType,
}

export enum MessageType {
  TEXT = 'text',
  LINK = 'link'
}

export const UserNamePlaceholders = {
  SYSTEM: '[Admin]',
  CURRENT_USER: '[Me]',
}
