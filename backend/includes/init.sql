CREATE TABLE IF NOT EXISTS cumulative_values (
        id INTEGER PRIMARY KEY,
        time_index INTEGER,
        value INTEGER
);

CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY,
        time TEXT,
        content TEXT,
        author TEXT
);

CREATE TABLE IF NOT EXISTS rating (
        id INTEGER PRIMARY KEY,
        userid TEXT,
		knowledgeid INTEGER,
		level INTEGER,
		value INTEGER
);