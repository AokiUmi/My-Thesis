/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useRef } from "react";
import "./textblock.css";

import { Divider, Typography } from "antd";
import Typography_Mui from "@mui/material/Typography";
const { Title, Paragraph, Text, Link } = Typography;
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import PropTypes from "prop-types";
import HexagonIcon from "@mui/icons-material/Hexagon";
import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="action" />,
    label: "Never heard before or Unfamiliar",
  },

  2: {
    icon: <SentimentSatisfiedIcon color="error" />,
    label: "Familiar but not proficient",
  },
  3: {
    icon: <SentimentSatisfiedAltIcon color="warning" />,
    label: "Basic Comprehend",
  },
  4: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Completely Mastered",
  },
};
const labels = {
  1: "Never heard before or Unfamiliar",
  2: "Familiar but not Proficient",
  3: "Basic Comprehend",
  4: "Completely Mastered",
};
function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}
function TextBlock(props) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const knowledge_info = props.knowledgeInfo;
  const getPanelStyle = (value) => {
    if (value === 1) return { color: "rgba(0, 0, 0, 0.54)" };
    else if (value === 2) return { color: "rgb(195 ,62 ,55)" };
    else if (value === 3) return { color: "rgb(250, 175, 0)" };
    else return { color: "rgb(46, 125, 50)" };
  };

  useEffect(() => {
    setValue(0);
    setOpen(false);
  }, [props.clickedId]);

  return (
    <>
      {props.clickedId === null && (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p> Click some nodes in the graph to see more</p>
        </div>
      )}
      {props.clickedId !== null && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "92vh",
            position: "relative",
          }}
        >
          <div
            className="knowledgecontent"
            style={{ maxHeight: "76vh", overflow: "auto", flexGrow: 1 }}
          >
            <Typography style={{ margin: "10px 10px 0px 10px " }}>
              <HexagonIcon
                style={{
                  transform: "translateY(3px) rotate(30deg)",
                  color: "#C39EFF",
                  alignSelf: "flex-start",
                }}
              />

              <Text
                underline
                level={2}
                style={{
                  alignItems: "center",
                  fontSize: "24px",
                  paddingLeft: "10px",
                  alignSelf: "flex-start",
                }}
              >
                {knowledge_info.name}
              </Text>
              <Paragraph style={{ fontSize: "16px", marginTop: "16px" }}>
                {knowledge_info.concept}
              </Paragraph>
            </Typography>
            <List sx={{ width: "100%", bgcolor: "#F1F2F3", marginTop: "18px" }}>
              <ListItemButton
                onClick={handleClick}
                sx={{
                  backgroundColor: "#F1F2F3",
                }}
              >
                <ListItemIcon>
                  <PlayArrowIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography_Mui variant="body1" fontWeight="bold">
                      Quiz
                    </Typography_Mui>
                  }
                />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                style={{ background: "white" }}
              >
                <Typography>
                  <Paragraph style={{ fontSize: "16px", marginTop: "16px" }}>
                    {knowledge_info.quiz}
                  </Paragraph>
                </Typography>
              </Collapse>
            </List>
          </div>
          <div style={ratingStyle}>
            <Typography_Mui component="legend" fontWeight="bold">
              Have you mastered it?
            </Typography_Mui>
            <StyledRating
              max={4}
              value={value}
              name="highlight-selected-only"
              defaultValue={0}
              IconContainerComponent={IconContainer}
              getLabelText={(value) => customIcons[value].label}
              highlightSelectedOnly
              onChange={(event, newValue) => {
                setValue(newValue);
                if (newValue > 0)
                  props.updateUserInfoList(newValue);
                
                  
              }}
              style={{ margin: "5px 0px 5px 0px  " }}
            />
            {value !== null && (
              <Typography_Mui component="legend" sx={getPanelStyle(value)}>
                {labels[value]}
              </Typography_Mui>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TextBlock;

const ratingStyle = {
  background: "#E1E1E1",
  position: "absolute",
  bottom: "6vh",
  width: "100%",
  height: "10vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
