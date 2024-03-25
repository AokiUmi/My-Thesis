/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext, useRef } from "react";
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

function MyPlayer(props) {
  const playerRef = useRef(null);
  const [comment, setComment] = useState('');
  let intervalId;
  sessionStorage.setItem('current_time', JSON.stringify(0));
  const [chapters, setChapters] = useState([]);
  const timelist = JSON.parse(sessionStorage.getItem('timelist'))?JSON.parse(sessionStorage.getItem('timelist')) : new Array(props.length).fill(0);
   // Update timelist and localStorage when player time changes
   const GetCurrentTime = () => {
    if (playerRef.current) {
      const current_time = playerRef.current.getCurrentTime();
      console.log("current time: ", current_time);
      const roundedTime = Math.floor(current_time);

      timelist[roundedTime]++;
      sessionStorage.setItem('timelist', JSON.stringify(timelist));
      sessionStorage.setItem('current_time', JSON.stringify(current_time));
      findChapter(current_time);
    }
  };
  function findChapter(timeInSeconds) {

    for (let chapter of chapters) {
      
        if (timeInSeconds >= chapter.time_begin && timeInSeconds < chapter.time_end) {
          sessionStorage.setItem('chapter_id', JSON.stringify(chapter.id));
          sessionStorage.setItem('chapter_name', JSON.stringify(chapter.name));
          console.log("ok")
        }
    }
   
}
  const setCurrentTime = (time) => {
    console.log('Setting time to:', time);
    playerRef.current.seekTo(time, 'seconds');
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleCommentSubmit = (id) => {
    // Add your logic to handle the comment submission here
    let now_time = playerRef.current.getCurrentTime();
    // post to backend
    if(props.username === '') {
       alert("You should Log in first!");
    }
    else if (comment === ''){
      alert("You should write your comment before sending!");
    }
    else {
        fetch("http://10.19.74.179:53706/api/addComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: Math.floor(now_time),
          author: id,
          content: comment
        }),
      }).then((res) => {
        if (res.ok) {
        alert("Successfully Upload!");
        } else {
          alert("Error!");
        }
      });
    }
    

  };
  const startClock = () => {
    if (!intervalId) {
      intervalId = setInterval(GetCurrentTime, 1000);
    }
  };

  const UploadDatabase = () => {
    fetch("http://10.19.74.179:53706/api/addTimeList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeList: timelist
      }),
    }).then((res) => {
      if (res.ok) {
       alert("Successfully Upload!");
      } else {
        alert("Error!");
      }
    });
  };
  const stopClock = () => {
    clearInterval(intervalId);
    intervalId = undefined; // Reset intervalId to undefined
    console.log(timelist);
  }
  useEffect(() => {
      fetch(`http://10.20.164.79:5000/api/chapter`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setChapters(data.chapters);
          const current_time = sessionStorage.getItem('current_time');
          findChapter(current_time);
      });

  }, []);

  let onreadybugfix = false;

  const reloadProgress = () => {
    if (!onreadybugfix) {
      const current_time = sessionStorage.getItem('current_time');
      console.log(`Setting to ${current_time}`);
      if (current_time) {
        setCurrentTime(Math.round(current_time));
        findChapter(current_time);
      }
      onreadybugfix = true;
    }
  };



  return (

    <Layout style={{overflow:"hidden"}} >
      <Content style={{ width: "1380px" }}>
        <Layout>
          <Content>
            <Layout>
              <Content className="player">
                <ReactPlayer width='100%' height='100%' onPlay={startClock} onPause={stopClock}
                  onEnded={stopClock} ref={playerRef} controls={true} onReady={reloadProgress}
                  url='https://robotics.shanghaitech.edu.cn/static/ca2020/CA2020_VenusTutorial1.mp4' />
              </Content>
              <Content className="comment">
      
                <Typography component="legend" sx={{
                  backgroundColor: 'rgb(39, 154, 255)',
                  color: 'white',
                  textAlign: "left",
                  fontSize: "18px",
                  paddingLeft: "20px",
                  paddingTop: "5px",
                  paddingBottom: "5px"
                }} >Comment</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', height: '21vh' }}>
                  <Input.TextArea
                    rows={2}
                    placeholder="Please leave your comment if you have problems"
                    value={comment}
                    onChange={handleCommentChange}
                    style={{ padding: "10px 18px 0 18px", minHeight: "9.8vh", borderRadius: 0, fontSize: "18px" }}
                  />
                  <Button variant="contained"
                    onClick={() => handleCommentSubmit(props.username)}

                    style={{
                      alignSelf: 'flex-end', marginRight: "20px",
                      height: "4vh", paddingTop: "0.2vh", paddingBottom: "0.2vh", paddingLeft: "3vh", paddingRight: "3vh", marginTop: "0.25vh"
                    }} >
                    Send
                  </Button>

                </div>

             
              </Content>
            </Layout>
          </Content>
          <Sider width="22%" style={siderStyle}>
            <Content className="button">

              {/* <h5  className="paragraph">If you have finished learning, please click the button!</h5> */}
              <Button variant="contained" onClick={UploadDatabase}>Finished</Button>

            </Content>

            <Content className="chapter">

              <div style={{ padding: "5px" }}>
                <List
                  sx={{ width: '100%', maxHeight: '94vh', bgcolor: '#e8e8e8', overflow: 'auto', '& ul': { padding: 10 }, }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <Typography component="legend" sx={{
                      backgroundColor: 'rgb(39, 154, 255)',
                      color: 'white',
                      textAlign: "left",
                      fontSize: "20px",
                      padding: "12px"
                    }} >Chapter List</Typography>
                  }
                >
                  {chapters.map((chapter) => {
                    return (
                      <ListItemButton sx={{ backgroundColor: "white" }} key={chapter.id} onClick={() => { setCurrentTime(chapter.time_begin) }}>
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
