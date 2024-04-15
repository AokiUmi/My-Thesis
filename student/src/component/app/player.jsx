/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext, useRef } from "react";
import "./player.css";
import { Layout, Flex } from "antd";
import ReactPlayer from "react-player";
const { Header, Footer, Sider, Content } = Layout;
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Chapters from "./test-data/chapter.json";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Card, Input } from "antd";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { NOWIP, PACHONGADDR } from "../../App";
import { VIDEO_URL } from "../../App";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { flush } from "../../App";
import { flush_timeinfo } from "../../App";
import { List as Ant_List } from "antd";
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
function MyPlayer(props) {
  const playerRef = useRef(null);
  const [comment, setComment] = useState("");
  let intervalId = null;
  const initial_time = sessionStorage.getItem("current_time")
    ? sessionStorage.getItem("current_time")
    : "0";
  const [chapters, setChapters] = useState([]);
  const timelist = JSON.parse(sessionStorage.getItem("timelist"))
    ? JSON.parse(sessionStorage.getItem("timelist"))
    : Array(props.length).fill(0);
  const speedlist = JSON.parse(sessionStorage.getItem("speedlist"))
    ? JSON.parse(sessionStorage.getItem("speedlist"))
    : Array(props.length).fill(0);
    const pauselist = JSON.parse(sessionStorage.getItem("pauselist"))
    ? JSON.parse(sessionStorage.getItem("pauselist"))
    : Array(props.length).fill(0);
    const commentlist = JSON.parse(sessionStorage.getItem("commentlist"))
    ? JSON.parse(sessionStorage.getItem("commentlist"))
    : Array(props.length).fill(0);
  // Update timelist and localStorage when player time changes
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [user_comments, setUser_comments] = useState([]);
  const [speed, setSpeed] = useState(1);
  const handleClick = () => {
    setOpen(!open);
  };
  const getCurrentTime = () => {
    if (playerRef.current) {
      return playerRef.current.getCurrentTime();
    }
  }
  const getCurrentSpeed = () => {
    if (playerRef.current) {
      return  playerRef.current.getInternalPlayer().playbackRate;
    }
  }
  const addPauseList = () => {
    const current_time = getCurrentTime();
    const roundedTime = Math.floor(current_time);
    pauselist[roundedTime]++;
    console.log("add pause list");
    sessionStorage.setItem("pauselist", JSON.stringify(pauselist));
  }
  const addCommentList = (current_time) => {
    const roundedTime = Math.floor(current_time);
    commentlist[roundedTime]++;
    sessionStorage.setItem("commentlist", JSON.stringify(commentlist));
  }
  const getCurrentInfo= () => {
    if (playerRef.current) {
      const current_time = getCurrentTime();
      console.log("current time: ", current_time);
      const current_speed = getCurrentSpeed();
      console.log("current speed: ", current_speed);
      if (JSON.parse(sessionStorage.getItem("current_time")) !== current_time) {
        console.log("memorize timelist and speedlist");
        const roundedTime = Math.floor(current_time);
        timelist[roundedTime]++;
        speedlist[roundedTime] += current_speed;
        sessionStorage.setItem("timelist", JSON.stringify(timelist));
        sessionStorage.setItem("speedlist", JSON.stringify(speedlist));
        sessionStorage.setItem("current_time", JSON.stringify(current_time));
        findChapter(current_time);
      }
  
    }
  };

  function findChapter(timeInSeconds) {
    for (let chapter of chapters) {
      if (
        timeInSeconds >= chapter.time_begin &&
        timeInSeconds < chapter.time_end
      ) {
        if (JSON.parse(sessionStorage.getItem("chapter_id") !== chapter.id))
          console.log("change chapter to: ", chapter.id),
            props.updateChapter(chapter.id);
        sessionStorage.setItem("chapter_id", JSON.stringify(chapter.id));
        sessionStorage.setItem("chapter_name", JSON.stringify(chapter.name));
        console.log("ok");
      }
    }
  }
  const setCurrentTime = (time) => {
    console.log("Setting time to:", time);
    sessionStorage.setItem("current_time", JSON.stringify(time));
    findChapter(time);
    playerRef.current.seekTo(time, "seconds");
    playerRef.current.getInternalPlayer().play();
  };
  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentTime(chapter.time_begin); // Assuming setCurrentTime is defined elsewhere
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handlePlaybackRateChange = (newSpeed) => {
    console.log('Playback speed changed:', newSpeed);
    // Perform any additional actions based on the new speed
    setSpeed(newSpeed);
    console.log("current_time_speed: ", newSpeed);
    if (!intervalId) {
        intervalId = setInterval(getCurrentInfo, 1000 / newSpeed);
    }
  };

  const handleCommentSubmit = (id) => {
    // Add your logic to handle the comment submission here
    let current_time = getCurrentTime();
    addCommentList(current_time);
    // post to backend
    if (props.username === "") {
      alert("You should Log in first!");
    } else if (comment === "") {
      alert("You should write your comment before sending!");
    } else {
      fetch(`http://${NOWIP}/api/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: Math.floor(current_time),
          author: id,
          content: comment,
        }),
      }).then((res) => {
        if (res.ok) {
          alert("Successfully Upload!");
          loadMyComments();
          setComment("");
        } else {
          alert("Error!");
        }
      });
    }
  };
  const startClock = () => {
    const current_speed = getCurrentSpeed();
    console.log("current_time_speed: ", current_speed);
    if (!intervalId) {
        intervalId = setInterval(getCurrentInfo, 1000 / current_speed);
    }
  };

  const UploadDatabase = () => {
    flush();
    flush_timeinfo();
  }
  const stopClock = () => {
    addPauseList();
    clearInterval(intervalId);
    intervalId = null; // Reset intervalId to undefined
    console.log(timelist);
 
  };
  const loadMyComments = () => {
    fetch(`http://${NOWIP}/api/getCommentsByAuthor?user=${props.username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser_comments(data.comments);
      });
  };
  const loadChapters = () => {
    fetch(`http://${PACHONGADDR}/api/chapter`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setChapters(data.chapters);
        sessionStorage.setItem(
          "chapter_name",
          JSON.stringify(data.chapters[0].name)
        );
        sessionStorage.setItem(
          "chapter_id",
          JSON.stringify(data.chapters[0].id)
        );
      });
  };
  useEffect(() => {
    loadChapters();
    loadMyComments();
  }, []);

  let onreadybugfix = false;

  const reloadProgress = () => {
    if (!onreadybugfix) {
      const current_time = JSON.parse(sessionStorage.getItem("current_time"))
        ? JSON.parse(sessionStorage.getItem("current_time"))
        : 0;
      console.log(`Setting to ${current_time}`);
      if (current_time) {
        playerRef.current.seekTo(current_time, "seconds");
        findChapter(current_time);
      }
      onreadybugfix = true;
    }
  };
  const deletePost = (meg_id , meg_time) => {
    const roundedTime = Math.floor(meg_time);
    commentlist[roundedTime]--;
    sessionStorage.setItem("commentlist", JSON.stringify(commentlist));
    fetch(`http://${NOWIP}/api/deleteComment?id=${meg_id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        alert("Successfully delete post!");
        loadMyComments();
      } else {
        alert("Something went wrong!");
      }
    });
  };

  return (
    <Layout style={{ width: "86%" }}>
      <Header className="headline">Course Name</Header>
      <Layout>
        <Content>
          <Layout>
            <Content className="player">
              <ReactPlayer
                width="100%"
                height="100%"
                onPlay={startClock}
                onPause={stopClock}
                onEnded={stopClock}
                ref={playerRef}
                controls={true}
                onReady={reloadProgress}
                onPlaybackRateChange={handlePlaybackRateChange}
                url={VIDEO_URL}
              />
            </Content>
          </Layout>
        </Content>
        <Sider width="30%" style={siderStyle}>
          <Content className="chapter">
            <List
              sx={{
                width: "100%",
                bgcolor: "#F1F2F3",
                overflow: "auto",
                "& ul": { padding: 10 },
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <Typography
                  component="legend"
                  fontWeight="bold"
                  sx={{
                    backgroundColor: "#F1F2F3",
                    color: "#191919",
                    textAlign: "left",
                    fontSize: "16px",
                    padding: " 16px 16px 8px 16px",
                  }}
                >
                  Chapter Selection
                </Typography>
              }
            >
              {chapters.map((chapter) => (
                <ListItemButton
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  selected={selectedChapter === chapter}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                    maxWidth: "100%",
                    backgroundColor:
                      selectedChapter === chapter ? "white" : "#F1F2F3",
                  }}
                >
                  <ListItemText
                    primary={chapter.name}
                    sx={{
                      color:
                        selectedChapter === chapter ? "#00AEEC" : "inherit",
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
            <div
              style={{
                marginTop: "1vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <List
                sx={{ width: "100%", bgcolor: "#F1F2F3", marginTop: "18px" }}
              >
                <ListItemButton
                  onClick={handleClick}
                  sx={{
                    backgroundColor: "#F1F2F3",
                  }}
                >
                  <ListItemIcon>
                    <PlayArrowIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold">
                        Your comments
                      </Typography>
                    }
                  />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Ant_List
                    itemLayout="horizontal"
                    dataSource={user_comments}
                    style={{ overflow: "auto", maxHeight: "37vh" }}
                    renderItem={(item) => (
                      <Ant_List.Item
                        style={{ background: "white", padding: "16px" }}
                      >
                        <Ant_List.Item.Meta
                          title={`Posted on ${formatTime(
                            Math.floor(item.time)
                          )}`}
                          description={item.content}
                        />
                        <Button
                          variant="text"
                          style={{ color: "#00AEEC" }}
                          onClick={() => deletePost(item.id,item.time)}
                        >
                          Delete
                        </Button>
                      </Ant_List.Item>
                    )}
                  />
                </Collapse>
              </List>

              <Input.TextArea
                placeholder="Comment here ..."
                value={comment}
                onChange={handleCommentChange}
                autoSize={{ minRows: 3, maxRows: 7 }}
                style={{ display: "flex", marginTop: "18px", fontSize: "16px" }}
              />
              <Button
                variant="contained"
                onClick={() => handleCommentSubmit(props.username)}
                style={{
                  display: "flex",
                  alignSelf: "flex-end",
                  marginTop: "10px",
                  backgroundColor: "#00AEEC",
                }}
              >
                Send
              </Button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  margin: "10px",
                }}
              >
                <Typography variant="body1">
                  If you finished learning, click the button!{" "}
                </Typography>

                <Button
                  variant="contained"
                  style={{
                    display: "flex",
                    alignSelf: "center",
                    backgroundColor: "#00AEEC",
                    marginTop: "10px",
                  }}
                  onClick={UploadDatabase}
                >
                  Finished
                </Button>
              </div>
            </div>
          </Content>
        </Sider>
      </Layout>
    </Layout>
  );
}

export default MyPlayer;
const siderStyle = {
  textAlign: "center",
  alignContent: "center",
  lineHeight: "88vh",
  color: "#fff",
  background: "white",
  marginLeft: "30px",
};
