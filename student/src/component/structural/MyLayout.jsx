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
import { MenuOutlined } from '@ant-design/icons';
import Home from '../app/home';
import MyImage from "../app/image";

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
      <Layout style={{display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden"}} >
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
            <Menu.Item key="1">
            <Link to="/" onClick={() => { setkeys('1');}}>Home</Link>
            </Menu.Item>
            { username !== '' && (
              <> 
                <Menu.Item key="2">
                <Link to="/courses" onClick={() => { setkeys('2'); }}>Course</Link>
                </Menu.Item>

                  <Menu.Item key="3">
                    <Link to="/image" onClick={() => { setkeys('3'); }}>Image</Link>
                  </Menu.Item>
              
                
              </>)
             
            }
            
         
            {
              username !== '' && (
              <Menu.Item key="username" style={{
                    position: 'absolute', right: -20,
                    color: 'white', pointerEvents: 'none',
                    opacity: 0.75
              }}>
          
                {"Hello "+username+" !"}
              </Menu.Item>
              )
            }
       
            </Menu>
            </Header>
        
              <Routes>
                <Route path="/" element={<Home handleUserSubmit={handleUsernameSubmit} username={username} setkey={setkeys} />} />
                <Route path="/courses" element={<MyPlayer username={username} length={6221} />} />
              <Route path="/image" element={<MyImage username={username} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
         
                  
      </Layout>
  
    </Router>
    


   
     
   
  );
}

export default MyLayout;


