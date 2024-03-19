/* eslint-disable no-unused-vars */
import { useEffect, useState,useRef} from "react";
import "./App.css";
import { Button, Card, Form } from "react-bootstrap";
import React from 'react'
import ReactPlayer from 'react-player'
function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [total, setTotal] = useState("");
  const [messages, setMessages] = useState([]);

  const load = () => {
    fetch("http://10.20.196.26:53706/api/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        
        
      });
  };
  const CountTotal = () => {
    fetch("http://10.20.196.26:53706/api/messages/total")
      .then((res) => res.json())
      .then((data) => {
        setTotal(data[0].total_post);
      
        
      });
  };
  useEffect(load, []);
  useEffect(CountTotal, []);
 

  const handlePost = () => {
    fetch("http://10.20.196.26:53706/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    }).then((res) => {
      if (res.ok) {
        alert("Created post!");
        load();
        CountTotal();
      } else {
        alert("Something went wrong!");
      }
    });
  };
  const deletePost = (meg_id) => {
    fetch(`http://10.20.196.26:53706/api/messages/${meg_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        alert("Delete post!");
        load();
        CountTotal();
      } else {
        alert("Something went wrong!");
      }
    });
  };

  const playerRef = useRef(null);
  const GetCurrentTime = () => {
    if (playerRef.current) {
      console.log("current time: ", playerRef.current.getCurrentTime());
    }
  }
  setInterval(GetCurrentTime, 1000);
  return (
    <div>
      <ReactPlayer url='https://www.youtube.com/watch?v=UaCL4LZbjXI' ref={playerRef} controls={true} />
      <Button onClick={GetCurrentTime}>Get Current Time</Button>
    
      {/* <h1>Welcome to BadgerChat Mini!</h1>
      <p>Total post is: {total }</p>
      <Form>
        <Form.Label htmlFor="title-inp">Title</Form.Label>
        <Form.Control
          id="title-inp"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></Form.Control>
        <Form.Label htmlFor="content-inp">Content</Form.Label>
        <Form.Control
          id="content-inp"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></Form.Control>
        <br />
        <Button onClick={handlePost}>Submit</Button>
      </Form>
      {messages.map((m) => (
        <Card key={m.id} style={{ marginTop: "1rem" }}>
          <h2>{m.title}</h2>
          <p>{m.content}</p>
          <Button style={{ backgroundColor: "red" }} onClick={()=>deletePost(m.id)} >
            Delete
          </Button>
        </Card>
      ))} */}
    </div>
  );
}

export default App;
