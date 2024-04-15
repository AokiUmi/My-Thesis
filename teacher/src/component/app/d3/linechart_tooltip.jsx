/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import "./linechart.css";
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3"; // Import d3 library
import { Input } from "antd";
import { VIDEO_DURATION } from "../../../App";
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

 
}

const LineChartToolTip = ({ data, svgWidth, svgHeight, tooltipTop , handleTimeChange, handleSeekTime }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const brushRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    // Clear existing SVG content
    svg.selectAll("*").remove();
    tooltip.selectAll("*").remove();
    // Define dimensions and margins
    const margin = { top: 10, right: 2, bottom: 5, left: 2 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    const color_list = [["rgba(217, 194, 255, 1)", "rgba(217, 194, 255, 0.18)"],
    ["rgba(255, 134, 134, 1)", "rgba(255, 134, 134, 0.1)"],
    ["rgba(146, 213, 237, 1)", "rgba(146, 213, 237, 0.2)"],
    ["rgba(136, 136, 136, 1)", "rgba(136, 136, 136, 0.2)"]
    ]
    const yScale_list = [[height, margin.top + 10], [height, margin.top + height / 2], [margin.top, height / 2], [height, height / 5 * 4]];
  
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(data[0], d => d.x), d3.max(data[0], d => d.x)])
      .range([margin.left, width]);

    data.forEach((list, index) => {
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(list, d => d.y)])
        .range(yScale_list[index]);

      // Create line generator
      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveCardinal.tension(0.5));
      
      let area;
      if (index === 2) {
        area = d3.area()
          .x(d => xScale(d.x))
          .y0(d => yScale(d.y)) // Bottom of the filled area is at the chart height (y=0 axis)
          .y1(margin.top)
          .curve(d3.curveCardinal.tension(0.5)); // Use curveCardinal interpolation

      } else {

        area = d3.area()
          .x(d => xScale(d.x))
          .y0(height) // Bottom of the filled area is at the chart height (y=0 axis)
          .y1(d => yScale(d.y))
          .curve(d3.curveCardinal.tension(0.5)); // Use curveCardinal interpolation
      }
      svg.append("path")
        .datum(list)
        .attr("pointer-events", "none")
        .attr("fill", color_list[index][1]) // Set fill color to light blue
        .attr("d", area);

      // Draw line
      svg.append("path")
        .datum(list)
        .attr("fill", "none")
        .attr("pointer-events", "none")
        .attr("stroke", color_list[index][0])
        .attr("stroke-width", 2)
        .attr("d", line);
     
    });

    console.log(tooltipTop)
    // Add overlay for capturing mouse events
   

    const Tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-color", "#CDCDCD")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "6px")
      .style("text-align", "left")
      .style("font-size", "14px")
      .style("display", "flex")
      .style("position", "absolute")
      .style("flex-direction", "column")
      .style("align-items", "center");
    
    // Add vertical line at mouseX
    const vertical_line = svg.append("line")
      .attr("class", "vertical-line")
      .style("opacity", 0)
      .attr("pointer-events", "none")
      .attr("stroke", "#888888")
      .attr("stroke-width", 2);

    const circleGroup = svg.append("g")
      .attr("class", "group")
      .attr("pointer-events", "none");
  
    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", handleMouseMove)
      .on("mouseover", handleMouseOver)
      .on("click", handleMouseClick)
      .on("mouseout", handleMouseOut);


    
    function handleMouseClick(event) {
      const mouseX = event.pageX - svg.node().getBoundingClientRect().left;
      const xValue = xScale.invert(mouseX);
      handleSeekTime(xValue);
    }
  
    function handleMouseOver(event) {
      circleGroup.style("opacity", 1);
      vertical_line.style("opacity", 1);
      Tooltip.style('opacity', 1);

    }
    // Function to handle mousemove event
    function handleMouseMove(event) {
      const mouseX = event.pageX - svg.node().getBoundingClientRect().left;
      const xValue = xScale.invert(mouseX);
      // console.log("x-value:",xValue);
      handleTimeChange(xValue);
      circleGroup.selectAll(".circle").remove(); // Remove any existing circles
      // // Add vertical line at mouseX
      vertical_line
        .attr("x1", mouseX)
        .attr("y1", margin.top)
        .attr("x2", mouseX)
        .attr("y2", height);


      let yValue_list = [];
      data.forEach((list, index) => {
        const bisect = d3.bisector(d => d.x).left;
        const indexAtMouseX = bisect(list, xValue, 1) > list.length -1 ? list.length -1 :bisect(list, xValue, 1) ;
        const yValue = list[indexAtMouseX].y;
        // console.log("index-x-value:",indexAtMouseX );
        // console.log("y-value: ",  yValue )
        yValue_list.push(yValue);
    
          // Add or update circles for each line at the corresponding y-value
        circleGroup.append("circle")
          .attr("class", "circle")
          .attr("cx", mouseX)
          .attr("cy", yScale_list[index][0] - (yScale_list[index][0] - yScale_list[index][1]) * (yValue / d3.max(list, d => d.y)))
          .attr("r", 4)
          .attr("stroke", "#888888")
          .attr("fill", color_list[index][0]);

   
      });
 
      const tooltipContent =  `<div>
          <strong style="margin: 8px 5px 8px 5px; font-size : 16px"> ${formatTime(Math.floor(xValue))} </strong>
          <p style="margin: 8px 5px 8px 5px"><span class="circle" style="background-color: ${color_list[0][0]};"></span>Total play: ${yValue_list[0]}</p>
          <p style="margin: 8px 5px 8px 5px"><span class="circle" style="background-color: ${color_list[1][0]} ;"></span>Avg Speed: ${yValue_list[1].toFixed(2)}</p>
          <p style="margin: 8px 5px 8px 5px"><span class="circle" style="background-color: ${color_list[2][0]}; "></span>Pause: ${yValue_list[2]}</p>
          <p style="margin: 8px 5px 8px 5px"><span class="circle" style="background-color: ${color_list[3][0]} ;"></span>Comments: ${yValue_list[3]}</p>
        </div>`;

      Tooltip
        .html(tooltipContent)
        .style("left", `calc(${mouseX}px + 8vw)`)  //  (mouseX + 130) + "px")
        .style("top", (tooltipTop +20) + "px")
        // .attr("pointer-events", "none")
        .style("user-select", 'none');
    }

    // Function to handle mouseout event
    function handleMouseOut() {
      circleGroup.style("opacity", 0);
      vertical_line.style("opacity", 0);
      Tooltip.style('opacity', 0);
      handleTimeChange(null);
    }

    // // Draw axes
    //  svg.append("g")
    //  .attr("transform", `translate(0,${height})`)
    //  .call(d3.axisBottom(xScale));

  //  svg.append("g")
  //    .attr("transform", `translate(${margin.left},0)`)
  //    .call(d3.axisLeft(yScale_timelist));
  }, [data, svgWidth, svgHeight]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>;
};
export default LineChartToolTip;


