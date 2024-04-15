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
        top: "4vh",
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
    const [chapter_list,setChapter_list] = useState([]);
    function findChapterId(currenttime , chapters) {
      if (currenttime === null) setNowchapter(-1);
      else {

         for (const chapter of chapters) {
        if (currenttime >= chapter.time_begin && currenttime < chapter.time_end) {
          setNowchapter(chapter.id);
        }
      }
      }
     
 
    }
    function findChapterIdsWithinInterval(timeInterval, chapters) {
      console.log(timeInterval)
      if(timeInterval === null) return [];
      const [x0, x1] = timeInterval;
      if (x0 === null || x1 === null) return []; // If any value in the time interval is null, return an empty array
    
      const ans= chapters
        .filter((chapter) =>  (x0 >= chapter.time_begin && x0 <=chapter.time_end) || 
        (x1 >=chapter.time_begin && x1<=chapter.time_end) ||
        (chapter.time_begin >=x0 && chapter.time_end <=x1) )
        .map((chapter) => chapter.id);
      return ans;
    }

  const transformSelect = (index) => {
    if (index === 0)
      return "translate(-2%, -50%)";
    else if(index === 1)
      return "translate(-2%, 20%)";
    else if(index === 2)
      return "translate(-2%, -50%)";
  }
  
  const transformSelect_single = (index) => {
    if (index === 0)
      return "translate(-2%, -50%)";
    else if(index === 1)
      return "translate(-2%, -50%)";
    else if(index === 2)
      return "translate(-50%, -50%)";
  }
  const loadChapterInfo = () => {
    fetch(`http://${PACHONGADDR}/api/chapter`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setChapters(data.chapters);
        findChapterId(props.currentTime, data.chapters);
        sessionStorage.setItem("chapter_index", JSON.stringify(0));
      });
  };
  useEffect(() => {
    loadChapterInfo();
  }, []);
  useEffect(() => {
    findChapterId(props.currentTime, chapters);
 
  }, [props.currentTime]);
  useEffect(() => {
 
    setChapter_list(findChapterIdsWithinInterval(props.timeInterval, chapters));
    console.log(chapter_list);
  }, [props.timeInterval]);

  return (
    
      <Box className={classes.root}>
        <Box className={classes.line} />

        {props.alignment === "tooltip" && chapters.map((chapter, index) => {
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
                        transform:  transformSelect_single(index)
                    }}>
                  {chapter.name}
                </Box>
              )}
            </React.Fragment>
          );
        })}

      {props.alignment === "selection" && chapters.map((chapter, index) => {
          const left = `${(chapter.time_begin / VIDEO_DURATION) * 100}%`; // Calculate position of dot
          const isChosen = chapter_list.includes(chapter.id);
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
                        transform: transformSelect(index)
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
