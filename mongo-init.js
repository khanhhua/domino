db.createUser(
    {
      user: "root",
      pwd: "root",
      roles: [
        {
          role: "readWrite",
          db: "domino"
        }
      ]
    }
);

db.players.insert({
  username: 'fatdev',
  alias: 'fatdev'
});

db.players.insert({
  username: 'maddev',
  alias: 'maddev'
});
