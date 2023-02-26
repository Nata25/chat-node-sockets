const users = [];

const addUser = (user) => {
  let { id, userName, room } = user;
  userName = userName.trim();
  room = room.trim();

  if (!userName || !room) {
    return { error: 'Username and room are required.' };
  }

  // Check for existing user
  const existingUser = users.find(user => user.userName === userName && user.room === room);
  if (existingUser) {
    return { error: 'Username is in use.' };
  }
  const newUser = { id, userName, room };
  users.push(newUser);
  return { user: newUser };
}

const removeUser = id => {
  const existingUserInd = users.findIndex(user => user.id === id);
  if (existingUserInd === -1) {
    return {
      error: 'User does not exist.'
    }
  }
  const deletedUser = users.splice(existingUserInd, 1)[0];
  console.log(deletedUser);
  return { user: deletedUser };
}

const getUser = id => {
  const existingUser = users.find(user => user.id === id);
  if (existingUser) return existingUser;
}

const getUsersInRoom = roomName => {
  return users.filter(user => user.room === roomName);
}

export { 
  addUser, 
  removeUser,
  getUser,
  getUsersInRoom,
}
