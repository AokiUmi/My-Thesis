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
import VideoImage from "./videoimage";
import { Typography } from "antd";
import { Stepper, Step, StepLabel, StepConnector, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;
import { NOWIP, PACHONGADDR } from "../../App";
import { Radio } from 'antd';
 
const Options = [ {
  label: 'Tooltip',
  value: 'tooltip',
},
{
  label: 'Range Selection',
  value: 'selection',
}];
function MainPage(props) {
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(null);
  const [currentSecond, setCurrentSecond] = useState(null);
  const [video_length, setVideo_length] = useState(0);
  const stepRef = useRef(null);
  const [alignment, setAlignment] =useState("tooltip");
  const handleTimeIntervalSelection = (newTimeInterval) => {
    setSelectedTimeInterval(newTimeInterval);
  };

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setAlignment(e.target.value);
    setSelectedTimeInterval(null);
    setCurrentSecond(null);
  };
   console.log(alignment);


  const handleCurrentSecondChange = (new_time) => {
    setCurrentSecond(new_time);
  };

  useEffect(() => {
    function updateDimensions() {
      if (stepRef.current) {
        const { width, height } = stepRef.current.getBoundingClientRect();
        setVideo_length(width);
        // Get a reference to the Content component with the className "videoimage"
    // const contentElement = document.querySelector('.steps');

    // Check if the element exists
      // if (contentElement) {
      //   // Get the bounding rectangle of the element
      //   const contentBounds = contentElement.getBoundingClientRect();

      //   // Extract the vertical position (top) of the element
      //   const contentTop = contentBounds.top;

      //   console.log("Position of .steps content (top):", contentTop);
      // } else {
      //   console.error("Element with class 'videoimage' not found.");
      // }
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
              <Header className="headline"  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text level={2} style={{whiteSpace: 'nowrap',fontSize:"24px",minWidth:"100px"}}>VideoData View</Text>
                <Radio.Group  className="radioGroup" options={Options} onChange={onChange} value={alignment} optionType="button" />
                  </Header>
              <Content className="steps" ref={stepRef}>
                <ChapterLine length={video_length} currentTime={currentSecond} timeInterval={selectedTimeInterval} alignment={alignment}/>
              </Content>
              <VideoImage handleTimeChange={handleCurrentSecondChange} handleTimeInterval={handleTimeIntervalSelection} alignment={alignment}/>
            </Layout>
          </Layout>

          <Sider style={siderStyle} width="30%">
            <Layout>
              <Header className="headline" >Student Comments</Header>

              <MyComments timeInterval={selectedTimeInterval}/>
            </Layout>
          </Sider>
        </Layout>
        <Layout>
          {/* <MyImage /> */}
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
