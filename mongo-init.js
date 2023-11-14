db.createUser({
    user: 'myAdminUser',
    pwd: 'myAdminPassword',
    roles: [
      {
        role: 'readWrite',
        db: 'pintrest-clone-react',
      },
    ],
  });
  