/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3"; // Import d3 library
import { Input } from "antd";



const LineChart = ({ data, svgWidth, svgHeight }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear existing SVG content
    svg.selectAll("*").remove();

    // Define dimensions and margins
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Flatten data and find the maximum value
    const maxValue = Math.max(...data.flat());

    // Create scales
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
      .range([margin.left, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height, margin.top]);

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.5));
    // Create an area generator
    const areaGenerator = d3.area()
      .x(d => xScale(d.x))
      .y0(height) // Bottom of the filled area is at the chart height (y=0 axis)
      .y1(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.5)); // Use curveCardinal interpolation

    // Draw the filled area
    svg.append("path")
    .datum(data)
    .attr("fill", "rgba(217, 194, 255, 0.3)") // Set fill color to light blue
    .attr("d", areaGenerator);

     // Draw line
     svg.append("path")
     .datum(data)
     .attr("fill", "none")
     .attr("stroke", "rgba(217, 194, 255, 1)")
     .attr("stroke-width", 2)
     .attr("d", line);

    // // // Draw lines
    // data.forEach((list, index) => {
    //   // const normalizedList = list.map(value => (value / maxValue) * height); // Normalize y-values
    //   console.log(list);
    //   svg.append('path')
    //     .datum(list)
    //     .attr('fill', 'none')
    //     .attr('stroke', `hsl(${index * 60}, 70%, 50%)`)
    //     .attr('stroke-width', 2)
    //     .attr('transform', `translate(${margin.left},${margin.top})`)
    //     .attr('d', line);
    // });

     // Draw axes
     svg.append("g")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(xScale));

   svg.append("g")
     .attr("transform", `translate(${margin.left},0)`)
     .call(d3.axisLeft(yScale));
  }, [data, svgWidth, svgHeight]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>;
};
export default LineChart;
