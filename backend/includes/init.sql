CREATE TABLE IF NOT EXISTS timeinfo (
        id INTEGER PRIMARY KEY,
        time_index INTEGER,
        value INTEGER
);
CREATE TABLE IF NOT EXISTS speedinfo (
        id INTEGER PRIMARY KEY,
        time_index INTEGER,
        value INTEGER
);

CREATE TABLE IF NOT EXISTS pauseinfo (
        id INTEGER PRIMARY KEY,
        time_index INTEGER,
        value INTEGER
);
CREATE TABLE IF NOT EXISTS commentinfo (
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