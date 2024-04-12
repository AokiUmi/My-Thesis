/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import "./mainpage.css";
import React, { useEffect, useState, useRef } from "react";
import { Stepper, Step, StepLabel, StepConnector, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { VIDEO_DURATION } from "../../App";
import { NOWIP, PACHONGADDR } from "../../App";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        top: "5vh",
        width: "100%",
        height: "20px", // Adjust height as needed
    },
    line: {
        position: "absolute",
        width: "100%",
        height: "2px", // Height of the line
        backgroundColor: "lightgrey", // Color of the line
        top: "50%", // Center the line vertically
        transform: "translateY(-50%)", // Offset to center the line vertically
    },
    dot: {
        position: "absolute",
        width: "15px", // Diameter of the dot
        height: "15px",
        backgroundColor: "white", // Color of the dot
        borderRadius: "50%", // Make the dot round
        top: "50%", // Center the dot vertically
        transform: "translate(-50%, -50%)", // Offset to center the dot vertically and horizontally
        border: "2px solid #888888", // Border color of the dot
    },
    chapterName: {
        position: "absolute",
        top: "-20px", // Position the text above the dot
        left: "50%", // Center the text horizontally
        transform: "translate(-50%, -50%)", // Offset to align with the dot horizontally
        fontSize: "16px",
        color: "black", // Color of the text
    },
    
    }));  

function ChapterLine(props) {
    const classes = useStyles();
    const [chapters, setChapters] = useState([]);
    const [stepinfo, setStepinfo] = useState([]);
    const [nowchapter, setNowchapter] = useState(0);
  
 
  const loadChapterInfo = () => {
    fetch(`http://${PACHONGADDR}/api/chapter`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setChapters(data.chapters);

        sessionStorage.setItem("chapter_index", JSON.stringify(0));
      });
  };
  useEffect(() => {
    loadChapterInfo();
  }, []);
  return (
    
      <Box className={classes.root}>
        <Box className={classes.line} />
        {chapters.map((chapter, index) => {
          const left = `${(chapter.time_begin / VIDEO_DURATION) * 100}%`; // Calculate position of dot
          const isChosen = nowchapter === chapter.id;
          return (
            <React.Fragment key={index}>
                  <Box className={classes.dot}
                     style={{
                        left,
                        backgroundColor: isChosen ? 'rgb(105, 200, 255)' : 'white', // Set background color based on condition
                     
                      }}
                  />
              {isChosen && (
                <Box className={classes.chapterName}
                    style={{
                        left,
                        transform: index === 0 ? "translate(-2%, -50%)"  : "translate(-50%, -50%)",
                    }}>
                  {chapter.name}
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
  
  );
}
export default ChapterLine;
