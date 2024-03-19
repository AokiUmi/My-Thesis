/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Input } from 'antd';
import ReactPlayer from 'react-player';

function MyPlayer(props) {


    return (
        <ReactPlayer width='100%' height='100%' controls={true} url='https://robotics.shanghaitech.edu.cn/static/ca2020/CA2020_VenusTutorial1.mp4' />
    );

}

export default MyPlayer;