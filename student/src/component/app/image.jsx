/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './image.css';
import React, { useEffect, useState } from 'react';
import DrawPolygon from './d3/drawpolygon';

import { Layout, Flex, Menu } from 'antd';
import TextBlock from './textblock';
import Button from '@mui/material/Button';
import { Typography } from 'antd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HexagonIcon from '@mui/icons-material/Hexagon';

const { Text} = Typography;
import { NOWIP, PACHONGADDR } from '../../App';

const { Header, Footer, Sider, Content } = Layout;
function MyImage(props) {
  const [polygonData, setPolygonData] = useState(null);
  const [vertexData, setVertexData] = useState(null);
  const lastClickedId = sessionStorage.getItem('clickedId') ? JSON.parse(sessionStorage.getItem('clickedId')) : null;
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
    fetch(`http://${PACHONGADDR}/api/getPolygonGroup?chapter=${chapterId}`)
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
    // if (polygonLevel === 1 || polygonLevel === 0) {
    //   fetch(`http://${PACHONGADDR}/api/userClick`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       username: props.username,
    //       knowledgeid: polygonId,
    //       chapterid: chapterId
    //     }),
    //   }).then((res) => {
    //     return res.json();
    //   })
    //     .then((data) => {
    //       console.log(data);
    //       setPolygonData(data);

    //     });

    // }

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
    <Layout style={{ width: "86%", overflow: "hidden" }}>
      <Content>
        <Layout>
          <Content className='top-content'>
            <Text level={2} style={{whiteSpace: 'nowrap',fontSize:"24px",minWidth:"100px"}}>Network View</Text>
            <List sx={{ display: 'flex', flexDirection: 'row', marginLeft: '100px',height:"80px",padding:0 ,overflow:"auto"}}>
                <ListItem sx={{padding:"0 10px 0 10px"}}>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#C39EFF"}}/>
                    </ListItemIcon>
                    <ListItemText
                      primary="Your are learning"
                      sx={{width:"150px"}}
                    />
                </ListItem>
                <ListItem sx={{padding:"0 10px 0 10px",marginLeft:"8px"}}>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#E1E1E1"}}/>
                    </ListItemIcon>
                    <ListItemText
                      primary="Your should already know"
                        sx={{width:"200px"}}
                    />
                </ListItem>
                <ListItem sx={{padding:"0 10px 0 10px",marginLeft:"8px"}}>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                      <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#FFDFAF"}}/>
                    </ListItemIcon>
                    <ListItemText
                      primary="Your have marked"
                        sx={{width:"150px"}}
                    />
                </ListItem>
            </List>
              
              {/* <p style={{ lineHeight: "18px", marginLeft: "30px", marginRight: "30px", fontSize: "18px" }}> Current Chapter is {chapterName} </p>
              <Button variant="contained" onClick={uploadRating} style={{ marginLeft: "30px", marginRight: "30px" }}> Upload</Button> */}
          </Content>
            <Content className='polygon'>
            {/* {polygonData !== null && vertexData !== null &&
              (<DrawPolygon polygonData={polygonData} vertexData={vertexData} svgWidth={1076} svgHeight={600} onPolygonClick={handlePolygonClick} />)} */}
          </Content>
        </Layout>
      </Content>
      
      <Sider width="30%" style={siderStyle}>
          <TextBlock updateUserInfoList={updateUserInfoList} knowledgeInfo={knowledgeInfo} clickedId={clickedPolygonId} />
        </Sider>
 

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