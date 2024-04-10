/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Input } from 'antd';
import ReactPlayer from 'react-player';
import { VIDEO_URL } from '../../App';
function MyPlayer(props) {


    return (
        <ReactPlayer width='100%' height='100%' controls={true} 
        url={VIDEO_URL} />
    );

}

export default MyPlayer;