# User schema

# --- !Ups

CREATE TABLE User (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    userId     VARCHAR(255) NOT NULL,
    providerId VARCHAR(255) NOT NULL,
    firstName  VARCHAR(255) NOT NULL,
    lastName   VARCHAR(255) NOT NULL,
    email      VARCHAR(255),
    avatarUrl  VARCHAR(255),
    authType   VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(userId, providerId)
);

# --- !Downs

DROP TABLE User;
