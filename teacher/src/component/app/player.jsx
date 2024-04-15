/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState,useRef,useEffect } from 'react';
import { Input } from 'antd';
import ReactPlayer from 'react-player';
import { VIDEO_URL } from '../../App';
function MyPlayer(props) {
    const playerRef = useRef(null);
    const setCurrentTime = (time) => {
        if (time === null) return;
        console.log("Setting time to:", time);
        playerRef.current.seekTo(time, "seconds");
        
      };
    useEffect(() => {
        setCurrentTime(props.seekTime);
     }, [props.seekTime]);
    return (
        <ReactPlayer width='100%' height='100%' controls={true} 
        url={VIDEO_URL}  ref={playerRef} />
    );

}

export default MyPlayer;