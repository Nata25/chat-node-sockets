export interface IUser {
  userName: string,
  room: string,
  id?: string, // coming from socket id after user has connected; undefined before the connection
}
