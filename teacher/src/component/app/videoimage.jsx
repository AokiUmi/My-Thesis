/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import "./mainpage.css";
import React, { useEffect, useState, useRef } from "react";

import { Layout, Flex } from "antd";

import { Typography } from "antd";

const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;
import { NOWIP, PACHONGADDR } from "../../App";
import LineChartTooltip from "./d3/linechart_tooltip";
import TEST_TIMEDATA from '../app/test-data/test_timelist.json';
import TEST_SPEEDDATA from '../app/test-data/test_speedlist.json';
import TEST_COMMENTDATA from '../app/test-data/test_commentlist.json';
import TEST_PAUSEDATA from '../app/test-data/test_pauselist.json';
import LineChartSelection from "./d3/linechart_selection";
import { VIDEO_DURATION } from "../../App";

function sumData(data , num) {
  const newData = [];
  let sum = 0;
  let startIndex = 0;

  for (let i = 0; i < data.length; i++) {
    // sum += data[i].y;
    sum = Math.max(sum, data[i].y);
    if ((i + 1) % num === 0) {
      newData.push({ x: startIndex, y: sum });
      startIndex += num;
      sum = 0;
    }
  }

  // Handle the remaining data if it's not a multiple of 5
  if (data.length % num !== 0) {
    newData.push({ x: startIndex, y: sum });
  }
  newData.push({ x: VIDEO_DURATION, y: sum });
  return newData;
}

function VideoImage(props) {
    const videoImageRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [video_data, setVideo_data] = useState(null);
    const [tooltip,setTooltip] =useState(0);
    let timelist, speedlist, pauselist, commentlist;
    function calculateAvgSpeed(speedList, timeList) {
        // Check if the lengths of both lists are the same
        if (speedList.length !== timeList.length) {
            throw new Error("Lists must have the same length");
        }
    
        let avgSpeedList = [];
    
        // Iterate through each item in the lists
        for (let i = 0; i < speedList.length; i++) {
            let speedObj = speedList[i];
            let timeObj = timeList[i];
    
            // Check if timeObj.y is not equal to 0
            if (timeObj.y !== 0) {
                // Calculate avgSpeedList.y = speedList.y / timeList.y
                avgSpeedList.push({ x: speedObj.x, y: speedObj.y / timeObj.y });
            } else {
                // If timeObj.y is 0, set avgSpeedList.y to 0
                avgSpeedList.push({ x: speedObj.x, y: 0 });
            }
        }
    
        return avgSpeedList;
    }
      async function fetchData() {
        try {
          const response1 = await fetch(`http://${NOWIP}/api/timeinfoTotalValue`);
          const data1 = await response1.json();
          console.log(data1);
          timelist = data1.timelist;
      
          const response2 = await fetch(`http://${NOWIP}/api/speedinfoTotalValue`);
          const data2 = await response2.json();
          console.log(data2);
          speedlist = data2.speedlist;
      
          const response3 = await fetch(`http://${NOWIP}/api/pauseinfoTotalValue`);
          const data3 = await response3.json();
          console.log(data3);
          pauselist = data3.pauselist;
      
          const response4 = await fetch(`http://${NOWIP}/api/commentinfoTotalValue`);
          const data4 = await response4.json();
          console.log(data4);
          commentlist = data4.commentlist;
          const avgSpeedList = calculateAvgSpeed(speedlist, timelist);
          console.log(avgSpeedList)
          // const combinedList = [TEST_DATA.timelist, TEST_DATA.speedlist, TEST_DATA.pauselist,TEST_DATA.commentlist];
         
          const resultList = [
            sumData(timelist,5),
            sumData(avgSpeedList, 5),
            sumData(pauselist,10),
            sumData(commentlist,10),
   
          ];
        
        const test_resultObject =[ 
          sumData(TEST_TIMEDATA.timelist,5),
          sumData(TEST_SPEEDDATA.speedlist, 5),
          sumData(TEST_PAUSEDATA.pauselist,8),
          sumData(TEST_COMMENTDATA.commentlist,8),
          
        ];
          console.log(test_resultObject); // Log combined list
          setVideo_data(test_resultObject);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    useEffect(() => {
        function updateDimensions() {
          if (videoImageRef.current) {
            const { width, height } = videoImageRef.current.getBoundingClientRect();
            setHeight(height);
            setWidth(width);
            // Get a reference to the Content component with the className "videoimage"
            const contentElement = document.querySelector('.videoimage');

            // Check if the element exists
            if (contentElement) {
              // Get the bounding rectangle of the element
              const contentBounds = contentElement.getBoundingClientRect();

              // Extract the vertical position (top) of the element
              const contentTop = contentBounds.top;
              const scrollY = JSON.parse(sessionStorage.getItem("scrollPosition"));
              console.log("Position of .videoimage content (top):", contentTop);
              setTooltip(contentTop + scrollY);
            } else {
              console.error("Element with class 'videoimage' not found.");
            }
          }
        }
        
        [500, 1000, 1500, 2000].forEach((value) => setTimeout(updateDimensions, value));
    
        // Call the updateDimensions function initially and add event listener for window resize
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
    
        // Remove event listener when component unmounts
        return () => {
          window.removeEventListener("resize", updateDimensions);
        };
      }, []);

      useEffect(() => {
        fetchData();
        document.querySelectorAll('.ant-table-selection-column').forEach(element => {
          element.style.display = 'none';
        });
        setTimeout(() => {
          document.querySelectorAll('.ant-table-selection-column').forEach(element => {
            element.style.display = 'none';
          });
        }, 500)
        setTimeout(() => {
          document.querySelectorAll('.ant-table-selection-column').forEach(element => {
            element.style.display = 'none';
          });
        }, 1000)
        setTimeout(() => {
          document.querySelectorAll('.ant-table-selection-column').forEach(element => {
            element.style.display = 'none';
          });
        }, 1500)
        setTimeout(() => {
          document.querySelectorAll('.ant-table-selection-column').forEach(element => {
            element.style.display = 'none';
          });
        }, 2000)
      }, []);
    return (

    <Content className="videoimage" ref={videoImageRef}>
      {
         props.alignment === "tooltip" &&
          video_data !== null && (
          <LineChartTooltip
              data={video_data}
              svgWidth={width}
              svgHeight={height}
              // onTimeIntervalSelection={handleTimeIntervalSelection}
              tooltipTop={tooltip}
              handleTimeChange={props.handleTimeChange}
              handleSeekTime={props.handleSeekTime}
          />
          )
      }
         {
         props.alignment === "selection" &&
          video_data !== null && (
          <LineChartSelection
              data={video_data}
              svgWidth={width}
              svgHeight={height}
              handleTimeInterval={props.handleTimeInterval}
              handleSeekTime={props.handleSeekTime}
          />
          )
      }
    </Content>
    );
    

}

export default VideoImage;