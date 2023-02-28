import { IUser } from "./models/user.interface";

const Sidebar = (props: { room: string, userName: string, users: IUser[] }) => {
  const { room, userName, users } = props;
  return (
    <div className="sidebar-content">
      <h2>Room: <span className="room">{ room }</span></h2>
      <p>You: <span className="user-name">{ userName }</span></p>
      {users.length > 0 && <>
        <p>Also in this room:</p>
        <ul className="users-list">
          {users.map(user => <li key={user.id}>{user.userName}</li>)}
        </ul>
      </>}
      {users.length === 0 && <p>No one else in this room.</p>}
    </div>
  )
}

export default Sidebar;
