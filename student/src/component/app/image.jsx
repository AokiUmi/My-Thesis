/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './image.css';
import React, { useEffect, useState } from 'react';
import DrawPolygon from './d3/drawpolygon';
import PolygonData from './test-data/final_20.json';
import VertexData from './test-data/final_20.json';
import { Layout, Flex, Menu } from 'antd';
import TextBlock from './textblock';
import Button from '@mui/material/Button';

import { NOWIP, PACHONGADDR } from '../../App';

const { Header, Footer, Sider, Content } = Layout;
function MyImage(props) {
  const [polygonData, setPolygonData] = useState(null);
  const [vertexData, setVertexData] = useState(null);
  const lastClickedId = JSON.parse(sessionStorage.getItem('clickedId')) ? JSON.parse(sessionStorage.getItem('clickedId')) : null;
  const [clickedPolygonId, setClickedPolygonId] = useState(lastClickedId);
  // Handler function for click event on polygon
  const chapterName = JSON.parse(sessionStorage.getItem('chapter_name'));
  const chapterId = JSON.parse(sessionStorage.getItem('chapter_id')) ? JSON.parse(sessionStorage.getItem('chapter_id')) : 1 ;
  const [userInfoList, setUserInfoList] = useState([]);
  const [knowledgeInfo, setKnowledgeInfo] = useState([]);

  const loadVertexData = () => {

    fetch(`http://${PACHONGADDR}/api/getVertexInfo?chapter=${chapterId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVertexData(data);

      });
  }


  const loadPolygonData = () => {
    fetch(`http://${PACHONGADDR}/api/getPolygonInfo?chapter=${chapterId}&username=${props.username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPolygonData(data);

      });
  }
  const loadKnowledgeInfo = () => {
    fetch(`http://${PACHONGADDR}/api/getKnowledgeInfo?id=${clickedPolygonId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setKnowledgeInfo(data.knowledge_info);

      });
  }

  const handlePolygonClick = (polygonId, polygonLevel) => {
    setClickedPolygonId(polygonId);
    if (polygonLevel === 1 || polygonLevel === 0) {
      fetch(`http://${PACHONGADDR}/api/userClick`, {
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
        return res.json();
      })
        .then((data) => {
          console.log(data);
          setPolygonData(data);

        });

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
    fetch(`http://${NOWIP}/api/addRatingData`, {
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
    if (clickedPolygonId !== null)
      loadKnowledgeInfo();
  }, [clickedPolygonId]);
  return (
    <Layout style={{ width: "1380px", overflow: "hidden" }}>
      <Content className='top-content'>
        <p style={{ lineHeight: "18px", marginLeft: "30px", marginRight: "30px", fontSize: "18px" }}> Current Chapter is {chapterName} </p>
        <Button variant="contained" onClick={uploadRating} style={{ marginLeft: "30px", marginRight: "30px" }}> Upload</Button>
      </Content>
      <Layout style={{ width: "1380px", maxHeight: "600px" }}>
        <Content className='polygon'>
          {polygonData !== null && vertexData !== null &&
            (<DrawPolygon polygonData={polygonData} vertexData={vertexData} svgWidth={1076} svgHeight={600} onPolygonClick={handlePolygonClick} />)}
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
  lineHeight: '600px',
  maxHeight: '600px',
  display: "flex", justifyContent: "center", alignItems: "center",
  color: 'black',
  background: 'rgb(235, 235, 235)',
  height: "600px"

};