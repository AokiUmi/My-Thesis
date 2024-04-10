/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './mainpage.css';
import React, { useState,useEffect ,useRef} from 'react';
import { Layout, Flex, Menu,  Tooltip ,Input} from 'antd';
import DrawPolygon from './d3/drawpolygon';
import { Typography } from 'antd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HexagonIcon from '@mui/icons-material/Hexagon';
const { Header, Footer, Sider, Content } = Layout;
const { Text} = Typography;
import { NOWIP, PACHONGADDR } from '../../App';
function MyImage(props) {
    const polygonRef = useRef(null);
    const [width,setWidth]=useState(0);
    const [height,setHeight]=useState(0);
    const [range,setRange]=useState({});
    useEffect(() => {
        function updateDimensions() {
    
        if (polygonRef.current) {
            const { width, height } = videoImageRef.current.getBoundingClientRect();
  
            setHeight(height);
            setWidth(width);
        }
        }

        // Call the updateDimensions function initially and add event listener for window resize
        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        // Remove event listener when component unmounts
        return () => {
        window.removeEventListener('resize', updateDimensions);
        };
        
    }, []);
    const [rating,setRating]= useState([]);
    const [polygonData,setPolygonData]= useState(null);
    useEffect(()=> {
    
        fetch(`http://${PACHONGADDR}/api/getFinalGraph`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setPolygonData(data);
                
            });
   
      },[]);
    return (
        <>
          <Content className='top-content'>
              <Text level={2} style={{whiteSpace: 'nowrap',fontSize:"24px",minWidth:"100px"}}>Network View</Text>
              <List sx={{ display: 'flex', flexDirection: 'row', marginLeft: '40px',height:"80px",padding:0 ,overflow:"auto"}}>
            
                <ListItem sx={{ padding: "0 0 0 10px" }}>
                      <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                        <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#C39EFF"}}/>
                      </ListItemIcon>
                      <Tooltip title="Knowledge taught from this class" placement="bottom" color="black">
                      <ListItemText
                        primary="You are teaching"
                        sx={{width:"170px"}}
                        />
                      </Tooltip>
                  </ListItem>
               
                  <ListItem sx={{padding:"0 10px 0 10px",marginLeft:"8px"}}>
                      <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                        <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#E1E1E1"}}/>
                  </ListItemIcon>
                    <Tooltip title="Prerequisite knowledge students should know before this class" placement="bottom" color="black">
                      <ListItemText
                        primary="Students should know before learning"
                          sx={{width:"290px"}}
                        />
                        </Tooltip>
                  </ListItem>
                  
              </List>
                
            </Content>
            <Content className='polygon'>
                <div  className='mask'>

                    {polygonData !== null && (<DrawPolygon data={polygonData} svgWidth={1380} svgHeight={680} />)}
            
                </div>
            </Content>
        </>


       
    );



}

export default MyImage;