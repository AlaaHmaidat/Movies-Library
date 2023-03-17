DROP TABLE IF EXISTS Movie;

CREATE TABLE IF NOT EXISTS Movie(
    id SERIAL PRIMARY KEY,
    title VARCHAR(1000),
    release_date DATE,
    overview TEXT,
    comment VARCHAR(1000)
);