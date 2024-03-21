/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './image.css';
import React, { useEffect, useState } from 'react';
import DrawPolygon from './d3/drawpolygon';
import PolygonData from './test-data/polygons.json';
import { Layout, Flex,Menu } from 'antd';
import TextBlock from './textblock';
import Button from '@mui/material/Button';
import Chapters from './test-data/chapter.json';

const { Header, Footer, Sider, Content } = Layout;
function MyImage(props) {
    const [clickedPolygonId,setClickedPolygonId] = useState(null);
    // Handler function for click event on polygon
    const [chapterName, setChaptersName] = useState('');
    const [chapterId, setChaptersId] = useState(0);
    const [userInfoList, setUserInfoList] = useState([]);
    const handlePolygonClick = async (polygonId) => {
        setClickedPolygonId(polygonId);
     
    };
    // Handler function for hover event on polygon
    const handlePolygonHover = (polygonId) => {
        setHoveredPolygonId(polygonId);
    };
    function findChapter(timeInSeconds) {
        for (let chapter of Chapters.chapters) {
            if (timeInSeconds >= chapter.time_begin && timeInSeconds < chapter.time_end) {
                setChaptersName(chapter.name);
                setChaptersId(chapter.id);
            }
        }
       
    }
    const updateUserInfoList = (newValue) => {
        const newItem = {
            userid: props.username,
            knowledgeid: clickedPolygonId,
            value: newValue
        };
        const updateList = [...userInfoList, newItem];
        setUserInfoList(updateList);
      
    };
    const uploadRating = () => {
         fetch("http://10.20.253.193:53706/api/addRatingData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ratinglist: userInfoList
           
            }),
          }).then((res) => {
            if (res.ok) {
              alert("Upload Successfully!");
            } else {
                alert("error!");
              }
          });
        setUserInfoList([]);
    }
   
    useEffect(() => { 
        const current_time = sessionStorage.getItem('current_time');
        findChapter(current_time);
    }, []);

    return (
        <Layout style={{ width: "1380px" }}>
            <Content className='top-content'>
               <p style={{lineHeight:"18px", marginLeft: "30px",marginRight: "30px",fontSize:"18px" }}> Now Chatper is {chapterName} </p>
                <Button variant="contained" onClick={uploadRating } style={{ marginLeft: "30px",marginRight: "30px" }}> Upload</Button>
            </Content>
            <Layout style={{ width: "1380px", maxHeight: "630px" }}>
                 <Content className='polygon'>
                <DrawPolygon data={PolygonData} svgWidth={1076} svgHeight={630} onPolygonClick={handlePolygonClick} />
                </Content>
                <Sider width="22%" style={siderStyle}>
                    <TextBlock updateUserInfoList={updateUserInfoList}  clickedId={clickedPolygonId} />
                </Sider>
            </Layout>
           
        </Layout>
       
    );
}

export default MyImage;

const siderStyle = {
    textAlign: 'center',
    lineHeight: '630px',
    maxHeight: '630px',
    display:"flex",justifyContent:"center",alignItems:"center",
    color: 'black',
    background: 'rgb(235, 235, 235)',
   
};