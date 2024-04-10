/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext,useRef } from "react";
import './MyLayout.css'
import { Typography } from 'antd';
const { Text} = Typography;
import { Layout, Menu } from 'antd';
import MyPlayer from "../app/player";
import MyComments from "../app/comment";
import MyImage from "../app/image";
import { UserOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;
import { Button } from "antd";
import VIDEO_DATA from '../app/test-data/video_data.json';
import VIDEO_DATA2 from '../app/test-data/video_data2.json';
import LineChart from '../app/d3/linechart';
// import VIDEO_DATA3 from '../app/test-data/video_data3.json';
import { NOWIP } from "../../App";
import MainPage from "../app/mainpage";
function MyLayout(props) {

  const [selectedKey, setSelectedKey] = useState('');
  const setkeys = (key) => {
    setSelectedKey(key);
  };
  const [page, setPage] = useState(1);
  return (


    <Layout style={{display:"flex",justifyContent:"center",alignItems:"center", width:"100%"}} >

            <Header className="header">
            <Menu
             theme="light"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              style={{
                flex: 1,
                minWidth: 0,
                position: 'relative'
              }}
            >
              <Menu.Item key="system" style={{pointerEvents: 'none' }}>
                System Name / Teacher-End
              </Menu.Item>
                <Menu.Item key="1" onClick={() => { setkeys('1'); setPage(1); }}>
                    Home
                </Menu.Item>
            
                <Menu.Item key="username" style={{
                    position: 'absolute', right: -20,
                    color: 'black', pointerEvents: 'none',
                    opacity: 1
              }}>
          
                <UserOutlined style={{ fontSize: '25px', margin: "10px"}}  />
              </Menu.Item>
        
            </Menu>
      </Header>
      
      {page === 1 && <MainPage />}
 
   
    </Layout>


   
     
   
  );
}

export default MyLayout;
const siderStyle = {

  lineHeight: '88vh',
  color: '#fff',
  background: 'white',
  marginLeft: "30px",

};