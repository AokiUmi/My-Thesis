/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Input } from 'antd';
import ReactPlayer from 'react-player';

function MyPlayer(props) {


    return (
        <ReactPlayer width='100%' height='100%' controls={true} 
        url='https://upos-sz-mirrorali.bilivideo.com/upgcxcode/53/69/552096953/552096953-1-16.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1711383570&gen=playurlv2&os=alibv&oi=17621919&trid=11b34e1db4a4465fa3cc7f10e4308a1ch&mid=0&platform=html5&upsig=9ebf5903f0d667bed751b5ff93c71807&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&bvc=vod&nettype=0&f=h_0_0&bw=24207&logo=80000000' />
    );

}

export default MyPlayer;