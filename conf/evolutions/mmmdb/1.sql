# Config schema

# --- !Ups

CREATE TABLE Config (
    id     BIGINT       NOT NULL AUTO_INCREMENT,
    fName  VARCHAR(255) NOT NULL,
    fValue VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

# --- !Downs

DROP TABLE Config;
