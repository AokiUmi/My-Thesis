/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState,useEffect } from 'react';
import { Input } from 'antd';
import PolygonData from '../app/test-data/polygons.json';
import DrawPolygon from './d3/drawpolygon';
function MyImage(props) {

    const [rating,setRating]= useState([]);
    const [polygonData,setPolygonData]= useState({});
    useEffect(()=> {
    
        fetch(`http://10.20.98.219:5000/xxxxx`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setPolygonData(data);
                
            });
     
      },[]);
    return (
        <div style={{maxHeight: "800px", width:"1380px",backgroundColor:"white"}}>
            <DrawPolygon data={PolygonData} svgWidth={1380} svgHeight={680} />
        </div>
    );



}

export default MyImage;