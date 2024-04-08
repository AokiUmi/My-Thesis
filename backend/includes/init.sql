CREATE TABLE IF NOT EXISTS cumulative_values (
        id INTEGER PRIMARY KEY,
        time_index INTEGER,
        value INTEGER
);

CREATE TABLE IF NOT EXISTS comment (
        id INTEGER PRIMARY KEY,
        time INTEGER,
        content TEXT,
        author TEXT,
        real_time DATETIME
);


CREATE TABLE IF NOT EXISTS rating (
        id INTEGER PRIMARY KEY,
        userid TEXT,
	knowledgeid INTEGER,
	value INTEGER
);