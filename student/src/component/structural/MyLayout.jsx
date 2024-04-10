/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import './MyLayout.css'
import { BrowserRouter as Router, Route, Routes,Link,  Navigate, useLocation   } from "react-router-dom";
import { Layout, Flex,Menu } from 'antd';
import ReactPlayer from 'react-player';
const { Header, Footer, Sider, Content } = Layout;
import MyPlayer from '../app/player';
import { UserOutlined } from '@ant-design/icons';
import Home from '../app/home';
import MyImage from "../app/image";
import { flash } from "../../App";
function MainPage(props) {
  const [chapter,setChapter]=useState(-1);
  const handerChapterChange = (newchapter) => {
    setChapter(newchapter);

  };
   return (
    <div style={{ paddingTop: "6vh", display: "flex", flexDirection: "column", alignItems: "center" ,width:"100%"}}>
      <MyPlayer username={props.username} length={6221} updateChapter={handerChapterChange} />
      <MyImage username={props.username} chapter={chapter}/>
    </div>
   );
}
function MyLayout(props) {

  const previous_user = JSON.parse(sessionStorage.getItem('username'))  ? JSON.parse(sessionStorage.getItem('username')) : '';
  const [username, setUsername] = useState(previous_user); 
  console.log(username);
  const handleUsernameSubmit = (enteredUsername) => {
    setUsername(enteredUsername);
    sessionStorage.setItem('username', JSON.stringify(enteredUsername));
  };

  const [selectedKey, setSelectedKey] = useState('');
  const setkeys = (key) => {
    setSelectedKey(key);
  };


  return (
    <Router >
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
              System Name / Student-End
            </Menu.Item>
            <Menu.Item key="1">
              <Link to="/" onClick={() => { setkeys('1'); flash(); }}>Home</Link>
            </Menu.Item>
            { username !== '' && (
              <> 
                <Menu.Item key="2">
                <Link to="/courses" onClick={() => { setkeys('2'); flash();}}>Course</Link>
                </Menu.Item>
                  {/* 
                  <Menu.Item key="3">
                    <Link to="/image" onClick={() => { setkeys('3'); }}>Image</Link>
                  </Menu.Item> */}
              
                
              </>)
             
            }
            
         
            {
              username !== '' && (
              <Menu.Item key="username" style={{
                    position: 'absolute', right: -20,
                    color: 'black', pointerEvents: 'none',
                    opacity: 1
              }}>
          
                {"Hello "+username+" !"}
                <UserOutlined style={{ fontSize: '25px', margin: "10px"}}  />
              </Menu.Item>
              )
            }
 
       
            </Menu>
            </Header>
        
              <Routes>
                <Route path="/" element={<Home handleUserSubmit={handleUsernameSubmit} username={username} setkey={setkeys} />} />
                <Route path="/courses" element={<MainPage username={username} />} />
            
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
         
                  
      </Layout>
  
    </Router>
    


   
     
   
  );
}

export default MyLayout;


