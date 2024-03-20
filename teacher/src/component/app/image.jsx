/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState,useEffect } from 'react';
import { Input } from 'antd';
import PolygonData from '../app/test-data/polygons.json';
import DrawPolygon from './d3/drawpolygon';
function MyImage(props) {

    const [rating,setRating]= useState([]);

    // useEffect(()=> {
    //     fetch("http://10.19.74.179:53706/api/getAllRatings")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       console.log(data);
    //       setRating(data.ratings);
          
    //     });
    //   },[]);
    return (
        <div style={{maxHeight: "800px", width:"1380px",backgroundColor:"white"}}>
            <DrawPolygon data={PolygonData} svgWidth={1380} svgHeight={680} />
        </div>
    );



}

export default MyImage;