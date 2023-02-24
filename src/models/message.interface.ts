export interface IMessageDTO {
  value: string,
  createdAt: string,
}

export interface IMessage extends IMessageDTO {
  type: MessageType,
}

export enum MessageType {
  TEXT = 'text',
  LINK = 'link'
}
