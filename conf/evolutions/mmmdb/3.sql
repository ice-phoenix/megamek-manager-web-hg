# PasswordInfo schema

# --- !Ups

CREATE TABLE PasswordInfo (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    user_id  BIGINT       NOT NULL,
    hasher   VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt     VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

INSERT INTO PasswordInfo(id, user_id, hasher, password, salt)
VALUES (1, 1, 'bcrypt', '$2a$10$GBZ4/5CI5g8tcEMgAYvRNOeLyxS7lhKa3ynVd8DxmNADlZvdTxXq6', null);

# --- !Downs

DROP TABLE PasswordInfo;
