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


const { Header, Footer, Sider, Content } = Layout;
function MyImage(props) {
    const [polygonData,setPolygonData]= useState(null);
    const [vertexData,setVertexData] = useState(null);
    const [clickedPolygonId,setClickedPolygonId] = useState(null);
    // Handler function for click event on polygon
    const chapterName= JSON.parse(sessionStorage.getItem('chapter_name'));
    const chapterId =JSON.parse(sessionStorage.getItem('chapter_id'));
    const [userInfoList, setUserInfoList] = useState([]);
    const [knowledgeInfo, setKnowledgeInfo] = useState([]);
 
    const loadVertexData = () => {
  
        fetch(`http://10.20.164.79:5000/api/getVertexInfo?chapter=${chapterId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setVertexData(data);
          
        });
    }
  
    
    const loadPolygonData = () => {
      fetch(`http://10.20.164.79:5000/api/getPolygonInfo?chapter=${chapterId}?username=${props.username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPolygonData(data);
        
      });
  }
    const loadKnowledgeInfo =() => {
        fetch(`http://10.20.164.79:5000/api/getKnowledgeInfo?id=${clickedPolygonId}`)
        .then((res) => res.json())
        .then((data) => {   
          console.log(data);
          setKnowledgeInfo(data.knowledge_info);
          
        });
      }
   
    const handlePolygonClick =  (polygonId) => {
        setClickedPolygonId(polygonId);
        fetch("http://10.20.164.79:5000/api/userClick", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: props.username,
              knowledgeid: polygonId,
              chapterid: chapterId
            }),
          }).then((res) => {
            if (res.ok) 
            alert("Successfully Upload!");
            else 
              alert("Error!");
            
             return res.json();
          })
          .then((data) => {   
            console.log(data);
            setPolygonData(data);
            
          });
      
    };

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
       
    }, []);
    useEffect(() => { 
        if( clickedPolygonId !== null)
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
                   {polygonData !== null && vertexData !== null && (<DrawPolygon polygonData={polygonData} vertexData={vertexData} svgWidth={1076} svgHeight={630} onPolygonClick={handlePolygonClick} />)} 
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