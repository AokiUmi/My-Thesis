/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext,useRef } from "react";
import './textblock.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
  }));
  
const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon color="action" />,
      label: 'Never heard before or Unfamiliar',
    },

    2: {
      icon: <SentimentSatisfiedIcon color="error" />,
      label: 'Familiar but not proficient',
    },
    3: {
        icon: <SentimentSatisfiedAltIcon color="warning" />,
        label: 'Basic Comprehend',
      },
    4: {
      icon: <SentimentVerySatisfiedIcon color="success" />,
      label: 'Completely Mastered',
    },
};
const labels = {
    1: 'Never heard before or Unfamiliar',
    2: 'Familiar but not Proficient',
    3: 'Basic Comprehend',
    4: 'Completely Mastered'
  };
function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }
  
  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }
function TextBlock(props) {
 
    const [value, setValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1); 
    const getPanelStyle = (value) => {
        
        if (value === 1)
            return {"color":"rgba(0, 0, 0, 0.54)"};
        else if (value === 2) return  {"color":"rgb(195 ,62 ,55)" };
        else if (value === 3) return {"color":"rgb(250, 175, 0)"};
        else return {"color":"rgb(46, 125, 50)"};
  };

  useEffect(() => {
   
    // fetch("http://10.19.74.179:53706/api/addRatingData", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           userid: props.userid,
    //           knowledgeid: props.clickedId,
    //           value: value,
           
    //         }),
    //       }).then((res) => {
    //         if (!res.ok) {
    //           alert("Error!");
    //         }
    //     });

    
      
      
   }, [value]);
   useEffect(() => {
    setValue(0);
   }, [props.clickedId]);
    return (
        <div style={{height: "680px", display: "flex", flexDirection: "column"}}>
        
            <Typography variant="h5" sx={{
                backgroundColor: 'rgb(39, 154, 255)',
                color: 'white',
                textAlign: "left",
                padding:"16px"
                }} >
                Sample Knowledge{props.clickedId}
            </Typography>
            <Typography variant="body1"  sx={{
                backgroundColor: 'rgb(197, 231, 255)',
                color: 'black',
                textAlign: "left",
                padding:"10px"
            }} >
               <Typography component="legend">Evaluate your own level of knowledge</Typography> 
                <StyledRating
                max={4}
                value={value}
                name="highlight-selected-only"
                defaultValue={0}
                IconContainerComponent={IconContainer}
                getLabelText={(value) => customIcons[value].label}
                highlightSelectedOnly
                onChange={(event, newValue) => {
                        setValue(newValue);}}
                style={{marginTop:"5px"}}
                />
                {value !== null && (
                    <Typography component="legend" sx={getPanelStyle(value)}>{labels[hover !== -1 ? hover : value]}</Typography>
                )
                }
            </Typography>
            <div style={{overflowY:"scroll"}}>
                <Accordion>
                  <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  >
                  <Typography>Concept</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget.
                  </Typography>
                  </AccordionDetails>
              </Accordion>
              <Accordion>
                  <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                  >
                  <Typography>Relative Concepts</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget.
                  </Typography>
                  </AccordionDetails>
              </Accordion>
              <Accordion>
                  <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                  >
                  <Typography>Quiz Example</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget.
                  </Typography>
                  </AccordionDetails>
              </Accordion>
            </div>
            
           
           
        </div>
    );
}

export default TextBlock;