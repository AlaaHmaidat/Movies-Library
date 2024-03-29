DROP TABLE IF EXISTS movie;

CREATE TABLE IF NOT EXISTS movie(
    id SERIAL PRIMARY KEY,
    title VARCHAR(1000),
    release_date VARCHAR(1000),
    poster_path VARCHAR(1000),
    overview VARCHAR(1000),
    comment VARCHAR(1000)
);