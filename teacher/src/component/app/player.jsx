/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Input } from 'antd';
import ReactPlayer from 'react-player';

function MyPlayer(props) {


    return (
        <ReactPlayer width='100%' height='100%' controls={true} 
        url='http://10.20.96.100:5000/api/video' />
    );

}

export default MyPlayer;