/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState,useEffect } from 'react';
import { Input } from 'antd';

import DrawPolygon from './d3/drawpolygon';
function MyImage(props) {

    const [rating,setRating]= useState([]);
    const [polygonData,setPolygonData]= useState(null);
    useEffect(()=> {
    
        fetch(`http://10.20.96.100:5000/api/getFinalGraph`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setPolygonData(data);
                
            });
     
      },[]);
    return (
        <div style={{maxHeight: "800px", width:"1380px",backgroundColor:"white"}}>
            {polygonData !== null && (<DrawPolygon data={polygonData} svgWidth={1380} svgHeight={680} />)}
        </div>
    );



}

export default MyImage;