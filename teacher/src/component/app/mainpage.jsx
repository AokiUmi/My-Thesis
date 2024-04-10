/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './mainpage.css';
import React, { useEffect, useState,useRef } from 'react';
import MyPlayer from "../app/player";
import MyComments from "../app/comment";
import MyImage from "../app/image";
import { styled } from '@mui/material/styles';
import { Layout, Flex, Menu,  Tooltip } from 'antd';
import Button from '@mui/material/Button';
import Typography_Mui from '@mui/material/Typography';
import { Typography } from 'antd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HexagonIcon from '@mui/icons-material/Hexagon';
const { Header, Footer, Sider, Content } = Layout;
const { Text} = Typography;
import { NOWIP, PACHONGADDR } from '../../App';
import LineChart from '../app/d3/linechart';
function MainPage(props) {
    const [selectedTimeInterval, setSelectedTimeInterval] = useState(null);
    const videoImageRef = useRef(null);
    const [width,setWidth]=useState(0);
    const [height,setHeight]=useState(0);
    useEffect(() => {
        function updateDimensions() {
    
        if (videoImageRef.current) {
            const { width, height } = videoImageRef.current.getBoundingClientRect();
            console.log(width,height);
            setHeight(height);
            setWidth(width);
        }
        }

        // Call the updateDimensions function initially and add event listener for window resize
        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        // Remove event listener when component unmounts
        return () => {
        window.removeEventListener('resize', updateDimensions);
        };
        
    }, []);

   
    const handleTimeIntervalSelection = (newTimeInterval) => {
      setSelectedTimeInterval(newTimeInterval);
    };
    const [video_data, setVideo_data] = useState(null);
    const handledatachange = (new_data) => {
      setVideo_data(new_data);
    }
      
    useEffect(()=>{
      fetch(`http://${NOWIP}/api/cumulativeValues`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVideo_data(data.video_data);
        
      });
  },[]);
  
    return (
      <div style={{ paddingTop: "6vh", display: "flex", flexDirection: "column", alignItems: "center" ,width:"100%"}}>
  
       
        <Content style={{ width: "86%"}}>
         <Layout >
        
            <Layout>
              <Header className="headline">
                  Course Name 
              </Header>
                <Content className="player">
                  <MyPlayer />
                </Content>
                <Content className="videoimage"  ref={videoImageRef}>
                {video_data !== null && <LineChart width={width} height={height} onTimeIntervalSelection={handleTimeIntervalSelection} data={video_data} /> }
              </Content>
                <MyImage />
  
            </Layout>
            
              
            <Sider style={siderStyle} width="30%">
              <Layout>
                <Header className="headline">
                Student Comments
                </Header>
                <Content className="comment">
                  <MyComments />
                </Content>
              </Layout>
               
            </Sider>
           
        
          </Layout> 
        </Content>
  
      </div>
  
      
    );
  }

  export default MainPage;
  const siderStyle = {

    lineHeight: '88vh',
    color: '#fff',
    background: 'white',
    marginLeft: "30px",
  
  };