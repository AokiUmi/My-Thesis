/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext,useRef } from "react";
import './MyLayout.css'

import { Layout, Menu } from 'antd';
import MyPlayer from "../app/player";
import MyComments from "../app/comment";
import MyImage from "../app/image";
import { MenuOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
import { Button } from "antd";
import VIDEO_DATA from '../app/test-data/video_data.json';
import VIDEO_DATA2 from '../app/test-data/video_data2.json';
import LineChart from '../app/d3/linechart';
// import VIDEO_DATA3 from '../app/test-data/video_data3.json';
const NOWIP = "10.20.253.193:53706";
function MainPage(props) {
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(null);

  const handleTimeIntervalSelection = (newTimeInterval) => {
    setSelectedTimeInterval(newTimeInterval);
  };
  const [video_data, setVideo_data] = useState(VIDEO_DATA.video_data);
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
    <>
     
      <Content style={{width:"1380px"}}>
       <Layout >
          <Sider width= "65%" style={siderStyle}>
            <Content className="player">
              <MyPlayer />
            </Content>
            <Content className="videoimage">
              <LineChart width={900} height={250} onTimeIntervalSelection={handleTimeIntervalSelection} data={video_data}  />
            </Content>
          </Sider>
          <Content className="comment">
            <MyComments selectedInterval={selectedTimeInterval}  />
          </Content>
      
        </Layout> 
      </Content>

    </>

    
  );
}
function MyLayout(props) {

  const [selectedKey, setSelectedKey] = useState('');
  const setkeys = (key) => {
    setSelectedKey(key);
  };
  const [page, setPage] = useState(1);
  return (
  
      <Layout style={{display:"flex",justifyContent:"center",alignItems:"center"}} >

            <Header className="header">
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              style={{
                flex: 1,
                minWidth: 0,
                position: 'relative'
              }}
            >
              <Menu.Item key="Icon" style={{pointerEvents: 'none' }}>
              <MenuOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              </Menu.Item>
                <Menu.Item key="1" onClick={() => { setkeys('1'); setPage(1); }}>
                    Home
                </Menu.Item>
                <Menu.Item key="2" onClick={() => { setkeys('2'); setPage(2); }}>
                   Image
                </Menu.Item>
             
        
            </Menu>
      </Header>
      
      {page === 1 && <MainPage />}
       {page === 2 && <MyImage />}
   
    </Layout>


   
     
   
  );
}

export default MyLayout;
const siderStyle = {
  textAlign: 'center',
  lineHeight: '95vh',
  color: 'black',
  background: '#d2d2d2',
};

