/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3"; // Import d3 library
import { Input } from "antd";



const LineChart = (props) => {
  const svgRef = useRef();
  const brushRef = useRef();
 
  // useEffect(() => {
  //   fetch("http://10.20.196.26:53706/api/hello-world")
  //   .then((res) => res.json())
  //   .then((data) => {
  //   console.log(data)
      
      
  //   });
  // }, []);

 
  useEffect(() => {
      
    d3.select(svgRef.current).selectAll("*").remove();
    
    const margin = { top: 20, right: 10, bottom: 20, left: 25 }; // Adjusted bottom margin for x-axis labels

    // const width = props.width ? Math.floor(props.width) - margin.left - margin.right :900;
    // const height = props.height? Math.floor(props.height) - margin.top - margin.bottom: 250;
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;
    let svg = d3.select(svgRef.current)
      .attr("width",props.width)
      .attr("height", props.height )
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


    const parseTime = d3.timeParse("%H:%M:%S");
    const formatTime = d3.timeFormat("%M:%S");
    const data = props.data.map(d => ({
      ...d,
      time: parseTime(d.time)
  }));
    console.log(data);
      let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([0, width]);

      let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)+1])
        .range([height, 0]);

      let line = d3.line()
        .x(d => x(d.time))
        .y(d => y(d.value));

      // Add x-axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M:%S")));

      // Add y-axis
      svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr('d', line);
   
      // Create brush
      const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('end', brushed);

      // Append brush to SVG
      svg.append('g')
        .attr('class', 'brush')
        .call(brush);

      brushRef.current = brush;
      
      function brushed(event) {
        if (!event.selection) {  props.onTimeIntervalSelection(null);return; } // Ignore if no selection

        const [x0, x1] = event.selection.map(x.invert);

        //Extract hours, minutes, and seconds from the Date objects
        const startTimeInSeconds = x0.getHours() * 3600 + x0.getMinutes() * 60 + x0.getSeconds();
        const endTimeInSeconds = x1.getHours() * 3600 + x1.getMinutes() * 60 + x1.getSeconds();

        // Emit selected time interval in seconds
        console.log('Selected x-interval (seconds):', [startTimeInSeconds ,endTimeInSeconds]);
        props.onTimeIntervalSelection([startTimeInSeconds ,endTimeInSeconds]);
        svg.on('click', () => {
          svg.select('.brush').call(brush.move, null);
          props.onTimeIntervalSelection(null);
        });
    }
     // Add tooltip

 

  }, [props.data]);

  return <svg ref={svgRef} ></svg>;
};
export default LineChart;
