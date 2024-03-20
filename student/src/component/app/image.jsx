/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './image.css';
import React, { useState } from 'react';
import DrawPolygon from './d3/drawpolygon';
import PolygonData from './test-data/polygons.json';
import { Layout, Flex,Menu } from 'antd';
import TextBlock from './textblock';
const { Header, Footer, Sider, Content } = Layout;
function MyImage(props) {
    const [clickedPolygonId,setClickedPolygonId] = useState(null);
    // Handler function for click event on polygon
    const handlePolygonClick = async (polygonId) => {
        setClickedPolygonId(polygonId);
        // try {
        // // Send POST request to /click endpoint to send the ID to the backend
        // await fetch('http://10.19.73.251:5000/api/click', {
        //     method: 'POST',
        //     headers: {
        //     'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ id: polygonId })
        // });

        // // Fetch updated data from the backend using GET request
        // const response = await fetch('http://10.19.73.251:5000/api/update-data');
        // if (!response.ok) {
        //     throw new Error('Failed to fetch updated data from backend');
        // }
        // const newData = await response.json();
        
        // // Update chart with new data
        // setChartData(newData);
        // } catch (error) {
        // console.error('Error updating data on backend:', error);
        // }
    };
    // Handler function for hover event on polygon
    const handlePolygonHover = (polygonId) => {
        setHoveredPolygonId(polygonId);
    };
    return (
        <Layout style={{width:"1380px",maxHeight: "680px"}}>
            <Content className='polygon'>
                <DrawPolygon data={PolygonData} svgWidth={1076} svgHeight={680} onPolygonClick={handlePolygonClick} />
            </Content>
            <Sider width="22%" style={siderStyle}>
                <TextBlock username={props.username} clickedId={clickedPolygonId} />
            </Sider>
        </Layout>
       
    );
}

export default MyImage;

const siderStyle = {
    textAlign: 'center',
    lineHeight: '690px',
    display:"flex",justifyContent:"center",alignItems:"center",
    color: 'black',
    background: 'rgb(235, 235, 235)',
   
};