/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import './image.css';
import React, { useEffect, useState ,useRef} from 'react';
import DrawPolygon from './d3/drawpolygon';
import { styled } from '@mui/material/styles';
import { Layout, Flex, Menu,  Tooltip } from 'antd';
import TextBlock from './textblock';
import Button from '@mui/material/Button';
import Typography_Mui from '@mui/material/Typography';
import { Typography } from 'antd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HexagonIcon from '@mui/icons-material/Hexagon';

import { flash } from '../../App';
const { Text} = Typography;
import { NOWIP, PACHONGADDR } from '../../App';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
const { Header, Footer, Sider, Content } = Layout;
function MyImage(props) {
  const polygonRef = useRef(null);
  const [width,setWidth]=useState(0);
  const [height,setHeight]=useState(0);
  const [polygonData, setPolygonData] = useState(null);
  const [vertexData, setVertexData] = useState(null);
  const lastClickedId = sessionStorage.getItem('clickedId') ? JSON.parse(sessionStorage.getItem('clickedId')) : null;
  const [clickedPolygonId, setClickedPolygonId] = useState(lastClickedId);
  // Handler function for click event on polygon
  const [initial_list, setInitial_list] = useState(null);
  const chapterName = JSON.parse(sessionStorage.getItem('chapter_name'));
  const chapterId = JSON.parse(sessionStorage.getItem('chapter_id')) ? JSON.parse(sessionStorage.getItem('chapter_id')) : 1 ;
  const [markedId, setMarkedId] = useState(null);
  const [userInfoList, setUserInfoList] = useState(null);
  const [knowledgeInfo, setKnowledgeInfo] = useState(null);
  const [if_load, setIf_load] = useState(false);
  useEffect(() => {
    function updateDimensions() {
  
      if (polygonRef.current) {
        const { width, height } = polygonRef.current.getBoundingClientRect();
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
  const loadVertexData = () => {

    fetch(`http://${PACHONGADDR}/api/getVertexInfo?chapter=${chapterId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVertexData(data);
        setIf_load(true);
      });
  }


  const loadPolygonData = () => {
    fetch(`http://${PACHONGADDR}/api/getPolygonGroup?chapter=${chapterId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPolygonData(data);

      });
  }
  const loadKnowledgeInfo = () => {
    fetch(`http://${PACHONGADDR}/api/getKnowledgeInfo?id=${clickedPolygonId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setKnowledgeInfo(data.knowledge_info);

      });
  }

  const handlePolygonClick = (polygonId) => {
    setClickedPolygonId(polygonId);


  }


  const updateUserInfoList = (newValue) => {
    setMarkedId(clickedPolygonId);
    const newItem = {
      userid: props.username,
      knowledgeid: clickedPolygonId,
      value: 4 - newValue
    };
    let updateList;
    if (userInfoList === null) updateList = [newItem];
    else {
      const updatedList = userInfoList.filter(item => 
        item.knowledgeid !== clickedPolygonId || item.userid !== props.username
    );
       updateList = [...updatedList, newItem];
    } 
    setUserInfoList(updateList);
    sessionStorage.setItem("rating_list", JSON.stringify(updateList));

  };
  const uploadRating = () => {
    flash();
    setUserInfoList(null);
 
  }
  const setInitialRatingList = () => {
    console.log("set initial list");
    fetch(`http://${NOWIP}/api/getRatingsByUser?user=${props.username}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setInitial_list(data.ratings);
      
    });

  }
  useEffect(() => {
    setIf_load(false);
    if (userInfoList !== null) // upload local cache first
      uploadRating();
    setInitialRatingList();
    loadPolygonData();
    loadVertexData();
   

  }, [props.chapter]);
  useEffect(() => {
    if (clickedPolygonId !== null)
      loadKnowledgeInfo();
  }, [clickedPolygonId]);
  return (
    <Layout style={{ width: "86%", overflow: "hidden" }}>
      <Content>
        <Layout>
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
              
              {/* <p style={{ lineHeight: "18px", marginLeft: "30px", marginRight: "30px", fontSize: "18px" }}> Current Chapter is {chapterName} </p>
              <Button variant="contained" onClick={uploadRating} style={{ marginLeft: "30px", marginRight: "30px" }}> Upload</Button> */}
          </Content>
          <Layout>
              <Content className='chapterName'>
              <Text level={2} style={{ alignItems:"center",whiteSpace: 'nowrap', fontSize: "24px", minWidth: "100px", alignSelf: "flex-start",marginTop:"10px" }}>
                Current Chapter: {chapterName}
              </Text>

              </Content>    
              <Content className='polygon' ref={polygonRef}>
            
              <div className='mask'>
                  {polygonData !== null && vertexData !== null && if_load === true && 
                  (<DrawPolygon initial_rating={ initial_list} mark={markedId} polygonData={polygonData} vertexData={vertexData} svgWidth={width} svgHeight={height} onPolygonClick={handlePolygonClick} />)}

              </div>
              
            </Content>
            </Layout>
       

        </Layout>
      </Content>
      
      <Sider width="30%" style={siderStyle}>
   
            <Layout>
              <Content className='knowledge-view'>
                  <Text level={2} style={{whiteSpace: 'nowrap',fontSize:"24px",minWidth:"100px",lineHeight:"8vh"}}>Knowledge View</Text>

              </Content>
              <Content className='knowledge-detail'>
            <TextBlock updateUserInfoList={updateUserInfoList} knowledgeInfo={knowledgeInfo} clickedId={clickedPolygonId} />
            </Content>
            </Layout>
          
             
      
        

        </Sider>
 

    </Layout>

  );
}

export default MyImage;


const siderStyle = {
  textAlign: 'center',
  alignContent: 'center',
  lineHeight: '100vh',
  color: '#fff',
  background: 'white',
  marginLeft: "30px",

};
