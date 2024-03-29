/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState,useEffect } from 'react';
import { Input } from 'antd';
import './app.css';
import Comments from './test-data/comments.json';
import Typography from '@mui/material/Typography';
import { Card } from 'antd';
import { Badge, Space } from 'antd';
import { useRef } from 'react';
import { NOWIP } from '../../App';
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    if (hours > 0) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
  
function MyComments(props) {
    const [chosenComment, setChosenComment] = useState(4);
    const [comments, setComments] = useState([]);
    
    const isChosenComment = (commentId) => chosenComment === commentId;

    const getPanelStyle = (comment) => {
        const commentTime = new Date(comment.time).getTime();
        if (props.selectedInterval != null) {
          
          const [startTime, endTime] = props.selectedInterval;
          if (comment.time >= startTime && comment.time <= endTime) {
            return {
              background: 'rgb(39, 154, 255)',
              '--background': 'rgb(209, 233, 255)',
              '--text-color': 'white',
            
            };
          }
        }
        return {
          background: 'rgba(0, 0, 0, 0.04)',
          '--background': 'white',
          '--text-color': 'black',
   
         
        };
      };
      useEffect(()=> {
        fetch(`http://${NOWIP}/api/getAllComments`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setComments(data.comments);
          
        });
      },[]);

  return (
    <div style={{width:"483px"}}>
      <Typography component="legend" sx={{
          backgroundColor: 'rgb(39, 154, 255)',
          color: 'white',
          textAlign: "left",
          fontSize:"20px",
          paddingLeft: "24px",
          paddingTop: "16px",
        paddingBottom: "16px",
        width:"483px"
          }} >Comments</Typography>
      <div style={{overflowY:"auto",height:"88vh",width:"483px"}}>
        {comments.map((comment) => {
                return (
                  <Card  title={"Posted by " + comment.author} key={comment.id}
                        style={getPanelStyle(comment)}className='card' >
                        <div >
                           <Space>
                                <Badge count={formatTime(comment.time)} />
                                <Badge color="rgb(255, 122, 171)" count={comment.author} /> 
                            </Space>
                        
                         <p>{comment.content}</p> 
                        </div>
                        
                    </Card>
                );  })}
            </div>
            
                              
            
          
      </div>
       

      
    );

}

export default MyComments;
