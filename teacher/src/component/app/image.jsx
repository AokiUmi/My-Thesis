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
    useEffect(() => {
        function updateDimensions() {
    
        if (polygonRef.current) {
            const { width, height } = videoImageRef.current.getBoundingClientRect();
            console.log(width,height);
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
              <List sx={{ display: 'flex', flexDirection: 'row', marginLeft: '100px',height:"80px",padding:0 ,overflow:"auto"}}>
            
                <ListItem sx={{ padding: "0 0 0 10px" }}>
                      <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                        <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#C39EFF"}}/>
                      </ListItemIcon>
                      <Tooltip title="Knowledge learned from this class" placement="bottom" color="black">
                      <ListItemText
                        primary="Advanced knowledge"
                        sx={{width:"170px"}}
                        />
                      </Tooltip>
                  </ListItem>
               
                  <ListItem sx={{padding:"0 10px 0 10px",marginLeft:"8px"}}>
                      <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                        <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#E1E1E1"}}/>
                  </ListItemIcon>
                    <Tooltip title="Basic knowledge you should know befor advanced knowledge" placement="bottom" color="black">
                      <ListItemText
                        primary="Prerequisite knowledge"
                          sx={{width:"170px"}}
                        />
                        </Tooltip>
                  </ListItem>
                  <ListItem sx={{padding:"0 10px 0 10px",marginLeft:"8px"}}>
                      <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                        <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#FFDFAF"}}/>
                  </ListItemIcon>
                  <Tooltip title="You only marked this knowledge" placement="bottom" color="black">
  
                      <ListItemText
                        primary="Marked one knowledge"
                          sx={{width:"170px"}}
                  />
                      </Tooltip>
                </ListItem>
                <ListItem sx={{padding:"0 10px 0 10px",marginLeft:"8px"}}>
                      <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
                        <HexagonIcon style={{ transform: 'rotate(30deg)' ,color:"#FF9F6C"}}/>
                  </ListItemIcon>
                  <Tooltip title="You marked this knowledge and its prerequisite knowledge" placement="bottom" color="black">
  
                      <ListItemText
                        primary="Marked more than one knowledge"
                          sx={{width:"260px"}}
                    />
                      </Tooltip>
                  </ListItem>
              </List>
                
            </Content>
            <Content className='polygon'>
                <div  className='mask'>

                    {/* {polygonData !== null && (<DrawPolygon data={polygonData} svgWidth={1380} svgHeight={680} />)} */}
            
                </div>
            </Content>
        </>


       
    );



}

export default MyImage;