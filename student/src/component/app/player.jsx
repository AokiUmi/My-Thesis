/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext,useRef } from "react";
import './player.css';
import { Layout, Flex } from 'antd';
import ReactPlayer from 'react-player';
const { Header, Footer, Sider, Content } = Layout;
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chapters from './test-data/chapter.json'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Card, Input } from 'antd';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MyImage from "./image";
function MyPlayer(props) {
    const playerRef = useRef(null);
    const [comment, setComment] = useState('');
    let intervalId; 
   
    const [chapters, setChapters] = useState([]);
    const [duration, setDuration] = useState(null);
    const timelist =  sessionStorage.getItem('timelist') ? sessionStorage.getItem('timelist') : new Array(length).fill(0);
    console.log(timelist);
    const getCurrentTime = () => {
        if (playerRef.current) {
            let current_time = playerRef.current.getCurrentTime();
            console.log("current time: ", current_time);
            timelist[Math.round(current_time)]++;
        }
    };
    const setCurrentTime = (time) => {
        playerRef.current.seekTo(time, 'seconds');
    };
    const handleCommentChange = (e) => {
        setComment(e.target.value);
      };
    const handleCommentSubmit = (id) => {
    // Add your logic to handle the comment submission here
        console.log('Comment submitted:', comment);
        let now_time = getCurrentTime();
        // post to backend
        
    };
    const startClock = () => {
        if (!intervalId) {
            intervalId = setInterval(getCurrentTime, 1000);
        }
    };
    const downloadJsonFile = () => {
        const jsonString = JSON.stringify(timelist);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'timelist.json'; // File name here
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    const stopClock = () => {
        clearInterval(intervalId);
        intervalId = undefined; // Reset intervalId to undefined
        console.log(timelist);
       
        // const fs = require('fs');
        // const jsonString = JSON.stringify(timelist );
        // fs.writeFile('./test-data/video_data.json', jsonString, (err) => {
        //     if (err) {
        //       console.error('Error writing file:', err);
        //       return;
        //     }
        //     console.log('List stored successfully!');
        //   });
    };
//     const loadChapters = () => {
//         fetch(
//             `./test-data/chapter.json`,
         
//           )
//             .then((res) => res.json())
//             .then((json) => {
//                 setChapters(json.chatpers);
//             });
    
//     }
    //    useEffect(loadChapters,[]);
    useEffect(() => {
        setChapters(Chapters.chapters);
    }, [chapters]);
    return (
     
        <Layout style={{overflow:"hidden"}}>
            <Content style={{width: "1380px"}}>
                <Layout>
                <Content>
                <Layout>
                    <Content className="player">
                        <ReactPlayer width='100%' height='100%' onPlay={startClock} onPause={stopClock}
                            onEnded={stopClock} ref={playerRef} controls={true}
                            url='https://robotics.shanghaitech.edu.cn/static/ca2020/CA2020_VenusTutorial1.mp4' />
                    </Content>
                    <Content className="comment">
                        {/* <Card title="Comment"
                            style={{backgroundColor: "white"}}
                            bodyStyle={{padding:0, minHeight:"16vh",  flex: 1,}}
                            headStyle={{ background: "#dfdfdf", borderRadius: 0, minHeight: "5vh" }}
                            
                        > */}
                         <Typography component="legend" sx={{
                                            backgroundColor: 'rgb(39, 154, 255)',
                                            color: 'white',
                                            textAlign: "left",
                                            fontSize:"20px",
                                            paddingLeft: "20px",
                                            paddingTop: "10px",
                                            paddingBottom:"10px"
                                            }} >Comment</Typography>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '21vh' }}>
                            <Input.TextArea
                                rows={2}
                                placeholder="Please leave your comment if you have problems"
                                value={comment}
                                onChange={handleCommentChange}
                                style={{padding: "10px 18px 0 18px",minHeight:"11.5vh",borderRadius:0, fontSize: "18px" }}
                            />
                                <Button  variant="contained"
                                    onClick={() => handleCommentSubmit(props.username)}
                                    
                                    style={{
                                    alignSelf: 'flex-end', marginRight: "20px",
                                    height: "4vh", paddingTop:"0.2vh", paddingBottom:"0.2vh",paddingLeft:"3vh",paddingRight:"3vh",marginTop:"0.25vh"
                                }} >
                                Send 
                                </Button> 

                             </div>
                                
                                {/* </Card> */}
                            </Content>
                        </Layout>
                    </Content>
                    <Sider width="22%" style={siderStyle}>
                        <Content className="button">
                       
                                {/* <h5  className="paragraph">If you have finished learning, please click the button!</h5> */}
                                <Button  variant="contained" onClick={() => downloadJsonFile()}>Finished</Button> 
                       
                        </Content>
                    
                        <Content className="chapter">
                      
                            <div style={{ padding: "5px" }}>
                                <List
                                    sx={{ width: '100%',maxHeight: '94vh', bgcolor: '#e8e8e8',  overflow: 'auto',  '& ul': { padding: 10 },}}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <Typography component="legend" sx={{
                                            backgroundColor: 'rgb(39, 154, 255)',
                                            color: 'white',
                                            textAlign: "left",
                                            fontSize:"20px",
                                            padding:"16px"
                                            }} >Chapter List</Typography>
                                    }
                                >
                                {chapters.map((chapter) => {
                                    return (
                                        <ListItemButton sx={{backgroundColor:"white"}} key={chapter.id} onClick={()=>{setCurrentTime(chapter.time_begin)}}>
                                            <ListItemIcon>
                                                <BookmarkIcon />
                                            </ListItemIcon>
                                        <ListItemText primary={chapter.name} />
                                    </ListItemButton>
                                    );
                                })}
                                </List>
                           
                            </div>
                        
                        </Content>
                    
                    </Sider>
                </Layout>
            </Content>
        
            
        </Layout>  
    
     
  
  
     
       
     
    );
  }
  
  export default MyPlayer;
  const siderStyle = {
    textAlign: 'center',
    lineHeight: '76vh',
    color: '#fff',
    background: '#d2d2d2',
};
