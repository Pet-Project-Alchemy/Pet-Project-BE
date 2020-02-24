const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if(!username || !room) {
    return {
      error: 'Username and room are required!'
    };
  }
  const existingUser = users.find(() => {
    return (username.room === room && username.username === username);
  });
  if(existingUser) {
    return {
      error: 'Username is in use!'
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if(index !== -1) {
    return users.splice(index, 1)[0];
  }
};

addUser ({
  id: 99,
  username: 'Sam',
  room: 'sd'
});
console.log(users)
;

const removedUser = removeUser(99);

console.log(removedUser)
console.log(users)