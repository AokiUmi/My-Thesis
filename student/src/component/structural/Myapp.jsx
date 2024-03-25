/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import './MyLayout.css';
import { BrowserRouter, Route, Routes,  Navigate } from "react-router-dom";

import { Layout, Flex,Menu } from 'antd';
import ReactPlayer from 'react-player';
const { Header, Footer, Sider, Content } = Layout;
import MyPlayer from '../app/player';
import MyLayout from "./MyLayout";
import Home from '../app/home';
import MyImage from "../app/image";
import d3ZoomContext from "../context/d3zoomContext";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function MyApp(props) {
    const previous_user = JSON.parse(sessionStorage.getItem('username'))  ? JSON.parse(sessionStorage.getItem('username')) : '';
    const [zoomTransform, setZoomTransform] = useState(null); 
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
        <BrowserRouter>
            <Layout style={{ display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }} >
                <Routes>
                    <Route path='/' element={<MyLayout />} />
                    <Route path='/home' element={<Home handleUserSubmit={handleUsernameSubmit} username={username} setkey={setkeys} />} />
                    <Route path="/courses" element={<MyPlayer username={username} length={928}  />} />
                    <Route path="/image" element={<MyImage username={username} />} />
                    <Route path="*" element={<Navigate to="/" />} />
              </Routes> 
            </Layout>
        </BrowserRouter>
        
    );
}
export default MyApp;