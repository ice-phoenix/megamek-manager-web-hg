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

# --- !Downs

DROP TABLE PasswordInfo;
