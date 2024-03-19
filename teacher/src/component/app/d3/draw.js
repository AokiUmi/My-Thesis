/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import VIDEO_DATA from '../test-data/video_data.json';

const draw = (props) => {
        
    d3.select('.linechart > *').remove();
    const data = VIDEO_DATA.video_data;
    const margin = { top: 20, right: 30, bottom: 20, left: 30 };
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;
    let svg = d3.select('.linechart').append('svg')
            .attr('width',width + margin.left + margin.right)
            .attr('height',height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let parseTime = d3.timeParse("%H:%M:%S");
    data.forEach(d => {
        d.time = parseTime(d.time);
    });


    let x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.time; }))
        .range([0, width]);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([height, 0]);

    
    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%M:%S")));

    // Add y-axis
    svg.append("g")
    .call(d3.axisLeft(y));
    
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.8)
        .attr("d", d3.line()
        .x(function(d) { return x(d.time) })
        .y(function(d) { return y(d.value) })
        )

    // Create brush
    let brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('end', brushed);

    // Append brush to SVG
    svg.append('g')
        .attr('class', 'brush')
        .call(brush);


    function parseSeconds(timeString) {
        // Split the time string into hours, minutes, and seconds parts
        const [hours, minutes, seconds] = timeString.split(':');
    
        // Parse hours, minutes, and seconds as integers
        const hoursInt = parseInt(hours);
        const minutesInt = parseInt(minutes);
        const secondsInt = parseInt(seconds);
    
        // Calculate total seconds
        const totalSeconds = hoursInt * 3600 + minutesInt * 60 + secondsInt;
    
        return totalSeconds;
    }
    function brushed(event) {
        if (!event.selection) {  props.onTimeIntervalSelection(null);return; } // Ignore if no selection

        const [x0, x1] = event.selection.map(x.invert);

        // Extract hours, minutes, and seconds from the Date objects
        const startTimeInSeconds = x0.getHours() * 3600 + x0.getMinutes() * 60 + x0.getSeconds();
        const endTimeInSeconds = x1.getHours() * 3600 + x1.getMinutes() * 60 + x1.getSeconds();
    
        // Emit selected time interval in seconds
        console.log('Selected x-interval (seconds):', [startTimeInSeconds, endTimeInSeconds]);
        props.onTimeIntervalSelection([startTimeInSeconds, endTimeInSeconds]);
        svg.on('click', () => {
        svg.select('.brush').call(brush.move, null);
        props.onTimeIntervalSelection(null);
        });
    }
    
}

export default draw;