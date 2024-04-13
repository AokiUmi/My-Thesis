/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import "./mainpage.css";
import React, { useEffect, useState, useRef } from "react";
import MyPlayer from "../app/player";
import MyComments from "../app/comment";
import MyImage from "../app/image";
import ChapterLine from "./chapterline";
import { Layout, Flex } from "antd";
import { AlignLeftOutlined } from "@ant-design/icons";

import { Typography } from "antd";
import { Stepper, Step, StepLabel, StepConnector, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;
import { NOWIP, PACHONGADDR } from "../../App";
import LineChart from "../app/d3/linechart";
import TEST_DATA from '../app/test-data/test_timelist.json';
function MainPage(props) {
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(null);
  const videoImageRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [video_data, setVideo_data] = useState(null);
  const [video_length, setVideo_length] = useState(0);
  const stepRef = useRef(null);
  let timelist, speedlist, pauselist, commentlist;
  useEffect(() => {
    function updateDimensions() {
      if (videoImageRef.current) {
        const { width, height } = videoImageRef.current.getBoundingClientRect();
        setHeight(height);
        setWidth(width);
      }
    }

    // Call the updateDimensions function initially and add event listener for window resize
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);
  useEffect(() => {
    function updateDimensions() {
      if (stepRef.current) {
        const { width, height } = stepRef.current.getBoundingClientRect();
        setVideo_length(width);
      }
    }

    // Call the updateDimensions function initially and add event listener for window resize
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);
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
      const combinedList = TEST_DATA.timelist;
      const resultObject = {
        timelist: timelist,
        avgspeedlist: avgSpeedList,
        commentlist: commentlist,
        pauselist: pauselist
    };
      console.log(resultObject); // Log combined list
      setVideo_data(combinedList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const loadVideoTimeline = () => {
   
    fetchData();
 
  };
  
  const generateTitleList = (chapters) => {
    const steps = chapters.map((chapter) => {
      const chapterDuration = chapter.time_end - chapter.time_begin;
      const stepWidth = (chapterDuration / VIDEO_DURATION) * video_length;

      return {
        title: chapter.name,
        description: "", // You can set the description here if needed
        width: stepWidth + "%",
      };
    });
    steps.push({
      title: "End",
      description: "", // You can set the description here if needed
      width: "5%", // Adjust the width according to your preference
    });
    return steps;
  };

  const handleTimeIntervalSelection = (newTimeInterval) => {
    setSelectedTimeInterval(newTimeInterval);
  };

  const handledatachange = (new_data) => {
    setVideo_data(new_data);
  };

  useEffect(() => {
    fetchData();
 
  }, []);

  return (
    <div
      style={{
        paddingTop: "6vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Content style={{ width: "86%" }}>
        <Layout>
          <Layout>
            <Header className="headline">Course Name</Header>
            <Content className="player">
              <MyPlayer />
            </Content>

            <Layout>
              <Header className="headline">VideoData View</Header>
              <Content className="steps" ref={stepRef}>
                <ChapterLine length={video_length} />
              </Content>
              <Content className="videoimage" ref={videoImageRef}>
                {video_data !== null && (
                  <LineChart
                    data={video_data}
                    svgWidth={width}
                    svgHeight={height}
                    onTimeIntervalSelection={handleTimeIntervalSelection}
                    
                  />
                )}
              </Content>
            </Layout>
          </Layout>

          <Sider style={siderStyle} width="30%">
            <Layout>
              <Header className="headline">Student Comments</Header>

              <MyComments />
            </Layout>
          </Sider>
        </Layout>
        <Layout>
          <MyImage />
        </Layout>
      </Content>
    </div>
  );
}

export default MainPage;
const siderStyle = {
  lineHeight: "88vh",
  color: "#fff",
  background: "rgb(245, 245, 245)",
  marginLeft: "30px",
};
