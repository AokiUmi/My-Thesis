// !!! IMPORTANT !!!
// Be sure to run 'npm run dev' from a
// terminal in the 'backend' directory!

import express from 'express';
import sqlite3 from 'sqlite3';
import fs from 'fs';

import {
    applyRateLimiting,
    applyLooseCORSPolicy,
    applyBodyParsing,
    applyLogging,
    applyErrorCatching
} from './api-middleware.js'

const app = express();
const port = 53706;

const INSERT_TIMELIST_SQL = "INSERT INTO cumulative_values (time_index, value) VALUES (?, ?);";
const GET_SUM_TIMELIST_SQL ="SELECT time_index, SUM(value) AS total_value FROM cumulative_values GROUP BY time_index;";
const INERST_COMMENT_SQL = "INSERT INTO comment (time, content, author, real_time) VALUES (?, ?, ?, ?);";
const DELETE_COMMENT_SQL = "DELETE FROM comment WHERE id = ?;";
const GET_COMMENTS_BY_AUTHOR_SQL = 'SELECT * FROM comment WHERE author = ? ORDER BY time;';
const GET_TOTAL_COMMENTS_SQL = "SELECT * FROM comment;";
const SELECT_RATING_SQL = "SELECT * FROM rating WHERE userid = ? AND knowledgeid = ?;";
const UPDATE_RATING_SQL = "UPDATE rating SET value = ? WHERE userid = ? AND knowledgeid = ?;";
const INSERT_RATING_SQL ="INSERT INTO rating (userid, knowledgeid, value) VALUES (?, ?, ?);";
const GET_TOTAL_RATING_SQL ="SELECT knowledgeid, SUM(value) AS learning_value FROM rating GROUP BY knowledgeid;";

const FS_DB = process.env['MINI_BADGERCHAT_DB_LOC'] ?? "./db.db";
const FS_INIT_SQL = "./includes/init.sql";

const db = await new sqlite3.Database(FS_DB, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
db.serialize(() => {
    const INIT_SQL = fs.readFileSync(FS_INIT_SQL).toString();
    INIT_SQL.replaceAll(/\t\r\n/g, ' ').split(';').filter(str => str).forEach((stmt) => db.run(stmt + ';'));
});

applyRateLimiting(app);
applyLooseCORSPolicy(app);
applyBodyParsing(app);
applyLogging(app);

app.get('/api/hello-world', (req, res) => {
    res.status(200).send({
        msg: "Hello! :)"
    })
})
// Function to transform time list into JSON format
function transformTimeListToJson(timeList) {
    const videoData = [];
    for (let i = 0; i < timeList.length; i++) {
        const hours = Math.floor(i / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((i % 3600) / 60).toString().padStart(2, '0');
        const seconds = (i % 60).toString().padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds}`;
        videoData.push({
            time: time,
            value: timeList[i]
        });
    }
    return { video_data: videoData };
}
// API endpoint to receive time list data
app.post('/api/addTimeList', (req, res) => {
    const timeList = req.body.timeList;

    // Assuming timeList is an array of numbers
    if (!Array.isArray(timeList)) {
        return res.status(400).json({ error: 'Invalid time list format' });
    }

    db.serialize(() => {
        const stmt = db.prepare(INSERT_TIMELIST_SQL);
        for (let i = 0; i < timeList.length; i++) {
            // Update or insert values into the database
            stmt.run(i, timeList[i]);
        }
        stmt.finalize();
    });

    return res.status(200).json({ message: 'Time list added successfully' });
});

// Endpoint to get cumulative values from the database
app.get('/api/cumulativeValues', (req, res) => {

    db.all(GET_SUM_TIMELIST_SQL, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        const cumulativeValues = rows.map(row => row.total_value);
        const jsonData = transformTimeListToJson(cumulativeValues);
        return res.status(200).json(jsonData);;
    });
});
// API endpoint to receive comment data
app.post('/api/addComment', (req, res) => {
    const time = req.body.time;
    const content = req.body.content;
    const author = req.body.author;
    const currentTime = new Date(); // Get the current real time
    db.run(INERST_COMMENT_SQL, [time, content, author, currentTime], function(err, ret) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to add comment' });
        }
        return res.status(200).json({ message: 'Comment added successfully' });
    });
});
// API endpoint to get all comments from the database for a specific author
app.get('/api/getCommentsByAuthor', (req, res) => {
    // Extract author name from request query parameters
    const author = req.query.user; // Use req.query.user to get the author name

    // Execute SQL query with the provided author name
    db.all(GET_COMMENTS_BY_AUTHOR_SQL, [author], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({ comments: rows });
    });
});

app.delete('/api/deleteComment', (req, res) => {
    // Extract author name from request query parameters
    const id = req.query.id; // Use req.query.id to get the author name

    // Execute SQL query to delete the comment by its ID
    db.run(DELETE_COMMENT_SQL, [id], (err) => {
        if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal server error' });
        }

       
        return res.status(200).json({ message: 'Comment deleted successfully' });
    });
});
// API endpoint to get all comments from the database
app.get('/api/getAllComments', (req, res) => {
  

    db.all(GET_TOTAL_COMMENTS_SQL, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json({ comments: rows });
    });
});
// API endpoint to receive user data
app.post('/api/addRatingData', (req, res) => {
    const ratingList = req.body.ratinglist; // Assuming the JSON object contains a key named 'ratinglist' with the list of ratings
    if (!Array.isArray(ratingList)) {
        return res.status(400).json({ error: 'Invalid rating list format' });
    }

    // Iterate through each rating in the list
    ratingList.forEach(rating => {
        const userid = rating.userid;
        const knowledgeid = rating.knowledgeid;
        const value = rating.value;

        db.get(SELECT_RATING_SQL, [userid, knowledgeid], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (row) {
                // If the row exists, update the value
                db.run(UPDATE_RATING_SQL, [value, userid, knowledgeid], function(err) {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Failed to update user data' });
                    }
                });
            } else {
                // If the row doesn't exist, insert a new row
                db.run(INSERT_RATING_SQL, [userid, knowledgeid, value], function(err) {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Failed to add user data' });
                    }
                });
            }
        });
    });

    return res.status(200).json({ message: 'User data processed successfully' });
});
// API endpoint to get all ratings
app.get('/api/getAllRatings', (req, res) => {

    db.all(GET_TOTAL_RATING_SQL, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const ratings = rows.map(row => ({
            id: row.knowledgeid,
            learning_value: row.learning_value,
        }));
        return res.status(200).json({ ratings: ratings });
    });
});
applyErrorCatching(app);

// Open server for business!
app.listen(port, () => {
    console.log(`My API has been opened on :${port}`)
});