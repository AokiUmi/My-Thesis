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

function MainPage(props) {
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(null);
  const videoImageRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [video_length, setVideo_length] = useState(0);
  const stepRef = useRef(null);
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
  const loadVideoTimeline = () => {
    fetch(`http://${NOWIP}/api/timeinfoTotalValue`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

      });
      fetch(`http://${NOWIP}/api/speedinfoTotalValue`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

      });
      fetch(`http://${NOWIP}/api/pauseinfoTotalValue`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

      });
      fetch(`http://${NOWIP}/api/commentinfoTotalValue`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

      });
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
  const [video_data, setVideo_data] = useState(null);
  const handledatachange = (new_data) => {
    setVideo_data(new_data);
  };

  useEffect(() => {
    loadVideoTimeline();
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
                {/* {video_data !== null && (
                  <LineChart
                    width={width}
                    height={height}
                    onTimeIntervalSelection={handleTimeIntervalSelection}
                    data={video_data}
                  />
                )} */}
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
