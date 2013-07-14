# user@mmm user

# --- !Ups

INSERT INTO User(userId, providerId, firstName, lastName, email, avatarUrl, authType)
VALUES ('user@mmm', 'userpass', 'The', 'Only', 'user@mmm', null, 'userPassword');

INSERT INTO PasswordInfo(user_id, hasher, password, salt) SELECT
max(id), 'bcrypt', '$2a$10$ozlVbJQVxuCZCjFtYya/Vup5PpfNiCS6203yUtO.QHZIwUtwdjZAm', null
FROM User;

INSERT INTO User_Role(user_id, role_id) SELECT
max(id), 3
FROM User;

# --- !Downs

DELETE FROM User WHERE userId = 'user@mmm' AND providerId = 'userpass';
