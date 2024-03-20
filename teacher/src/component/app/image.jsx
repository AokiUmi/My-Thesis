/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import { Input } from 'antd';
import PolygonData from '../app/test-data/polygons.json';
import DrawPolygon from './d3/drawpolygon';
function MyImage(props) {

    return (
        <div style={{maxHeight: "800px", width:"1380px",backgroundColor:"white"}}>
            <DrawPolygon data={PolygonData} svgWidth={1380} svgHeight={680} />
        </div>
    );



}

export default MyImage;