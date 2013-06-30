# Role schema

# --- !Ups

CREATE TABLE Role (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE User_Role (
    id      BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES Role(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

INSERT INTO Role(id, name)
VALUES (1, 'God'),
       (2, 'Admin'),
       (3, 'User');

INSERT INTO User_Role(user_id, role_id)
VALUES (1, 1),
       (1, 2),
       (1, 3);

# --- !Downs

DROP TABLE User_Role;

DROP TABLE Role;
