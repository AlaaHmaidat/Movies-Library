DROP TABLE IF EXISTS Movie;

CREATE TABLE IF NOT EXISTS Movie(
    id SERIAL PRIMARY KEY,
    title VARCHAR(1000),
    release_date VARCHAR(1000),
    overview VARCHAR(1000),
    comment VARCHAR(1000)
);