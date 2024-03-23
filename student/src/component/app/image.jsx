/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './image.css';
import React, { useEffect, useState } from 'react';
import DrawPolygon from './d3/drawpolygon';
import PolygonData from './test-data/final_20.json';
import VertexData from './test-data/final_20.json';
import { Layout, Flex,Menu } from 'antd';
import TextBlock from './textblock';
import Button from '@mui/material/Button';
import Chapters from './test-data/chapter.json';

const { Header, Footer, Sider, Content } = Layout;
function MyImage(props) {
    const [polygonData,setPolygonData]= useState({});
    const [vertexData,setVertexData] = useState({});
    const [clickedPolygonId,setClickedPolygonId] = useState(null);
    // Handler function for click event on polygon
    const [chapterName, setChaptersName] = useState('');
    const [chapterId, setChaptersId] = useState(0);
    const [userInfoList, setUserInfoList] = useState([]);
    const [knowledgeInfo, setKnowledgeInfo] = useState([]);
    const loadVertexData = () => {
        fetch(`http://10.20.98.219:5000/xxxxx?chapter=${chapterId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setVertexData(data);
          
        });
    }
    const loadPolygonData = () => {
        fetch(`http://10.20.98.219:5000/xxxxx?chapter=${chapterId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPolygonData(data);
          
        });
    }
    const loadKnowledgeInfo =() => {
        fetch(`http://10.20.98.219:5000/xxxxx?chapter=${chapterId}&id=${clickedPolygonId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setKnowledgeInfo(data.knowledge_info);
          
        });
      }
    const handlePolygonClick = async (polygonId) => {
        setClickedPolygonId(polygonId);
        fetch("http://10.20.98.219:5000/api/userClick", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: props.username,
              knowledgeid: clickedPolygonId,
              chapterid: chapterId
            }),
          }).then((res) => {
            if (res.ok) {
            alert("Successfully Upload!");
            } else {
              alert("Error!");
            }
          });
        loadPolygonData();
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
            value: 4 - newValue
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
        loadPolygonData();
        loadVertexData();
        const current_time = sessionStorage.getItem('current_time');
        findChapter(current_time);
    }, []);
    useEffect(() => { 
        loadKnowledgeInfo();
    }, [clickedPolygonId]);
    return (
        <Layout style={{ width: "1380px" }}>
            <Content className='top-content'>
               <p style={{lineHeight:"18px", marginLeft: "30px",marginRight: "30px",fontSize:"18px" }}> Current Chapter is {chapterName} </p>
                <Button variant="contained" onClick={uploadRating } style={{ marginLeft: "30px",marginRight: "30px" }}> Upload</Button>
            </Content>
            <Layout style={{ width: "1380px", maxHeight: "630px" }}>
                 <Content className='polygon'>
                <DrawPolygon polygonData={polygonData} vertexData={vertexData} svgWidth={1076} svgHeight={630} onPolygonClick={handlePolygonClick} />
                </Content>
                <Sider width="22%" style={siderStyle}>
                    <TextBlock updateUserInfoList={updateUserInfoList} knowledgeInfo={knowledgeInfo} clickedId={clickedPolygonId} />
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