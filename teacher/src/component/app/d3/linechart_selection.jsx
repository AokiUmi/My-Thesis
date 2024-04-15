/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import "./linechart.css";
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3"; // Import d3 library
import { Input } from "antd";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

 
}

const LineChartSelection = ({ data, svgWidth, svgHeight, handleTimeInterval, handleSeekTime}) => {
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
    const color_list= [ ["rgba(217, 194, 255, 1)","rgba(217, 194, 255, 0.18)"] , 
    ["rgba(255, 134, 134, 1)" , "rgba(255, 134, 134, 0.1)"], 
    ["rgba(146, 213, 237, 1)", "rgba(146, 213, 237, 0.2)"] , 
    ["rgba(136, 136, 136, 1)", "rgba(136, 136, 136, 0.2)"]
  ]
    const yScale_list = [ [height, margin.top+10] , [height, margin.top+height/2] ,[margin.top,height/2] ,[height, height/5*4]];
  
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(data[0], d => d.x), d3.max(data[0], d => d.x)])
      .range([margin.left, width]);

    data.forEach( (list, index) => {
      const yScale = d3.scaleLinear()
      .domain([0, d3.max(list, d => d.y)])
      .range(yScale_list[index]);

      // Create line generator
      const line= d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.5));
      
      let area;
      if(index === 2){
       area = d3.area()
        .x(d => xScale(d.x))
        .y0(d => yScale(d.y)) // Bottom of the filled area is at the chart height (y=0 axis)
        .y1(margin.top)
        .curve(d3.curveCardinal.tension(0.5)); // Use curveCardinal interpolation

      }else {

        area = d3.area()
          .x(d => xScale(d.x))
          .y0(height) // Bottom of the filled area is at the chart height (y=0 axis)
          .y1(d => yScale(d.y))
          .curve(d3.curveCardinal.tension(0.5)); // Use curveCardinal interpolation
      }
      svg.append("path")
      .datum(list)
      .attr("fill", color_list[index][1]) // Set fill color to light blue
      .attr("d", area);

      // Draw line
      svg.append("path")
      .datum(list)
      .attr("fill", "none")
      .attr("stroke", color_list[index][0])
      .attr("stroke-width", 2)
      .attr("d", line);
     
    });

 
    // Add overlay for capturing mouse events
   

  
  


    
     // Add brush
     const brush = d3.brushX()
     .extent([[0, 0], [width, svgHeight]])
     .on("end", handleBrush);

    brushRef.current = brush;

    const brushGroup = svg.append("g")
    .attr("class", "brush")
    .call(brush);

      // Style the brush elements using CSS
    d3.select(".brush .selection")
    .style("stroke", "rgb(215 215 215)") // Change the stroke color
    .style("fill-opacity", "0.1"); // Change the fill opacity
  
    
    // Function to handle brush end event
    function handleBrush(event) {
      if (!event.selection) { handleTimeInterval(null);return;} // Ignore if no selection

      const [x0, x1] = event.selection.map(xScale.invert);

      // Do something with the selected range (x0 and x1)
      console.log("Selected Range (x-axis):", x0, x1);
      handleTimeInterval([x0,x1]);
      svg.on('click', (event) => {
        handleMouseClick(event);
        svg.select('.brush').call(brush.move, null);
        handleTimeInterval(null);
        
      });
    }

  
    function handleMouseClick(event) {
      const mouseX = event.pageX - svg.node().getBoundingClientRect().left;
      const xValue = xScale.invert(mouseX);
      handleSeekTime(xValue);
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
export default LineChartSelection;


