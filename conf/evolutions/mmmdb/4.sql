# Token schema

# --- !Ups

CREATE TABLE Token (
    id      BIGINT       NOT NULL AUTO_INCREMENT,
    uuid    VARCHAR(255) NOT NULL,
    email   VARCHAR(255) NOT NULL,
    created TIMESTAMP    NOT NULL,
    expires TIMESTAMP    NOT NULL,
    signUp  BOOLEAN      NOT NULL,
    PRIMARY KEY(id)
);

# --- !Downs

DROP TABLE Token;
