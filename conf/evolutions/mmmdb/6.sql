# Route schema

# --- !Ups

CREATE TABLE Route (
    id      BIGINT       NOT NULL AUTO_INCREMENT,
    pattern VARCHAR(255) NOT NULL,
    mode    TINYINT      NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Role_Route (
    id       BIGINT NOT NULL AUTO_INCREMENT,
    role_id  BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id)  REFERENCES Role(id)  ON DELETE CASCADE,
    FOREIGN KEY(route_id) REFERENCES Route(id) ON DELETE CASCADE,
    UNIQUE(role_id, route_id)
);

# --- !Downs

DROP TABLE Role_Route;

DROP TABLE Route;
