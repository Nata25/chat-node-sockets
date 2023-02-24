export interface IMessage {
  type: MessageType,
  value: string,
}

export enum MessageType {
  TEXT = 'text',
  LINK = 'link'
}
