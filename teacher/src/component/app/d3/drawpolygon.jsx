/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export function zoomTransformStringToObject(str) {
  // Parse the translation and scale values from the string
  const translateRegex = /translate\(([^,]+),([^,]+)\)/g;
  const scaleRegex = /scale\(([^)]+)\)/g;

  const translateMatch = translateRegex.exec(str);
  const scaleMatch = scaleRegex.exec(str);

  const translateX = parseFloat(translateMatch[1]);
  const translateY = parseFloat(translateMatch[2]);
  const scale = parseFloat(scaleMatch[1]);

  // Create and return a zoom transform object
  return d3.zoomIdentity.translate(translateX, translateY).scale(scale);
}

// Function to deepen the color
const deepenColor = (originalColor) => {
  // Create a color object from the hexadecimal string
  const colorObj = d3.color(originalColor);
  // Darken the color by 0.5 (50%)
  const deepenedColor = colorObj.darker(0.5).toString();
  // Return the deepened color as a hexadecimal string
  return deepenedColor;
}
const DrawPolygon = ({ data, svgWidth, svgHeight, onPolygonClick, ratingdata }) => {
  const svgRef = useRef();
  let initial_zoom = sessionStorage.getItem("zoom") ? zoomTransformStringToObject(sessionStorage.getItem("zoom")) : null;
  const initial_clicked = sessionStorage.getItem("clickedId") ? JSON.parse(sessionStorage.getItem("clickedId")) : null;
  const [node, setNode] = useState(initial_clicked);
  const [zoomTransform, setZoomTransform] = useState(initial_zoom);
  let if_initial = false;
  let now_edgelist= [];
  const previousClickedGroup = sessionStorage.getItem("clickedGroup") ? JSON.parse(sessionStorage.getItem("clickedGroup")) : null;
  const [clickedGroup, setClickedGroup] = useState(previousClickedGroup);

  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const PurpleColorScale = d3.scaleSequential()
      .domain([0, d3.max(data.polygons, d => d.learning_value)]) // Reverse the domain
      .interpolator(d3.interpolate("#EBDFFF", "#9250FF")); // Interpolate colors from light red to lighter red // Interpolate colors from light blue to dark blue

    const GreyColorScale = d3.scaleSequential()
      .domain([0, d3.max(data.polygons, d => d.learning_value)]) // Reverse the domain
      .interpolator(d3.interpolate("#EEEEEE", "#888888"));  // Interpolate colors from light orange to dark orange
      const g = svg.append('g');
    const colorselect = (d) => {
        let color = '';
        if (d.level === 1 || d.level === 0)
          color = PurpleColorScale(d.learning_value);
        else color = GreyColorScale(d.learning_value);
        if (d.id === node)
          color = deepenColor(color);
        return color;
      };
  
      // const polygonsGroup = g.append('g');
  
      const Tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("text-algin", "center")
        .style("font-size", "18px")
        .style("position", "absolute");
    
     
      const groupSelection = g.selectAll('.group')
        .data(data.polygons)
        .enter().append('g')
        .attr('class', 'group')
        .attr('id', d => `group-${d.group_id}`); // Assign unique IDs based on center polygon ID
  
      groupSelection.each(function (groupData) {
      
        const group = d3.select(this);
        const centerPoly = [groupData.center_poly];
        const level2Polygons = groupData.margin_polygons;
        const edges = groupData.edges;
        if (clickedGroup === groupData.group_id)
          now_edgelist = edges;
          
        // Draw level 2 polygons
        group.selectAll('.margin-polygon')
          .data(level2Polygons)
          .enter().append('polygon')
          .attr('class', 'margin-polygon')
          .attr('id', d => `polygon-${d.id}`)
          .attr('points', d => d.region.map(vertexId => {
            const vertex = data.vertices_dict[vertexId];
            return `${vertex[0]},${-vertex[1]}`;
          }).join(' '))
          .style('stroke', 'white') // Change stroke color if needed
          .style('opacity', (clickedGroup === groupData.group_id ? 1 : 0)) // Set opacity based on comparison
          .style('stroke-width', '2') // Adjust stroke width if needed
          .style('fill', colorselect) // Apply fill after stroke
          .on('click', handlePolygonClick) // Handle click event
          .on('mouseover', function (event, d) {
              Tooltip
                .style("opacity", 1)
                .html(d.name)
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY - 36) + "px");
  
            
            
          }) // Handle mouseover event
          .on('mousemove', function (event, d) {
              Tooltip
                .style('opacity', 1)
                .html(d.name)
                .style('left', (event.pageX + 20) + 'px')
                .style('top', (event.pageY - 36) + 'px');
  
            
          })
          .on('mouseleave', function (d) {
            Tooltip.style('opacity', 0);
          });
        // Draw center polygon
        group.append('polygon')
          .data(centerPoly)
          .attr('class', 'center-polygon')
          .attr("id", d => `polygon-${d.id}`)
          .attr('points', d => d.region.map(vertexId => {
            const vertex = data.vertices_dict[vertexId];
            return `${vertex[0]},${-vertex[1]}`;
          }).join(' '))
          .style('stroke', 'white') // Change stroke color if needed
          .style('stroke-width', '2') // Adjust stroke width if needed
          .style('fill', colorselect) // Apply fill after stroke
          .on('click', (event, d) => {
     
            setNode(d.id);
            // Save current zoom transform state
            const now_zoom = d3.zoomTransform(svg.node());
            setZoomTransform(now_zoom);
            sessionStorage.setItem("zoom", now_zoom.toString());
            sessionStorage.setItem("clickedGroup", groupData.group_id);
            setClickedGroup(groupData.group_id);
            now_edgelist = edges;
            sessionStorage.setItem("clickedId", d.id);
          
          })
          .on('mouseover', function (event, d) {
            Tooltip
              .style("opacity", 1)
              .html(d.name)
              .style("left", (event.pageX + 20) + "px")
              .style("top", (event.pageY - 36) + "px");
          }) // Handle mouseover event
          .on('mousemove', function (event, d) {
            Tooltip
              .style('opacity', 1)
              .html(d.name)
              .style('left', (event.pageX + 20) + 'px')
              .style('top', (event.pageY - 36) + 'px');
          })
          .on('mouseleave', function () {
            Tooltip.style('opacity', 0);
          });
         
        
      });
      function StoreZoomInStorage(zoom) {
        console.log("update zoom", zoom);
        const now_chapter = JSON.parse(sessionStorage.getItem("chapter_id"));
        let previous_zoomInfo = sessionStorage.getItem("zoomlist") ? JSON.parse(sessionStorage.getItem("zoomlist")) : null;
         // Check if previous_zoomInfo contains an object with chapterid equal to now_chapter
        if (previous_zoomInfo) {
          const index = previous_zoomInfo.findIndex(item => item.chapterid === now_chapter);
          if (index !== -1) {
              // If chapterid exists, update the zoom value
              previous_zoomInfo[index].zoom = zoom;
          } else {
              // If chapterid does not exist, add a new object to the zoomlist
              previous_zoomInfo.push({ chapterid: now_chapter, zoom: zoom });
          }
  
        }
        else  previous_zoomInfo=[{ chapterid: now_chapter, zoom: zoom }];
        
        // Store the updated zoomlist back into sessionStorage
        sessionStorage.setItem("zoomlist", JSON.stringify(previous_zoomInfo));
      }
      
    
      const edges=g.selectAll('.edges')
      .data(now_edgelist)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('x1', d => data.points_dict[d.from][0])
      .attr('y1', d => -data.points_dict[d.from][1])
      .attr('x2', d => data.points_dict[d.to][0])
      .attr('y2', d => -data.points_dict[d.to][1])
      .style('stroke', 'rgb(153, 116, 115)')
      .style('stroke-width', '1');// Set opacity based on comparison
      
        // Add arrows to the edges
      const arrowSize = 5; // Size of the arrow
      edges.each(function (d) {
        const x1 = data.points_dict[d.from][0];
        const y1 = -data.points_dict[d.from][1];
        const x2 = data.points_dict[d.to][0];
        const y2 = -data.points_dict[d.to][1];
  
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
  
        // Calculate distance to move the arrowhead along the edge line
        const distance = 2; // Adjust this value as needed
        const newX2 = x2 - distance * Math.cos(angle);
        const newY2 = y2 - distance * Math.sin(angle);
  
        // Calculate points for the arrowhead
        const x3 = newX2 - arrowSize * Math.cos(angle - Math.PI / 6);
        const y3 = newY2 - arrowSize * Math.sin(angle - Math.PI / 6);
        const x4 = newX2 - arrowSize * Math.cos(angle + Math.PI / 6);
        const y4 = newY2 - arrowSize * Math.sin(angle + Math.PI / 6);
  
        // Draw arrowhead
        d3.select(this.parentNode)
          .append('polygon')
          .attr('points', `${newX2},${newY2} ${x3},${y3} ${x4},${y4}`)
          .style('fill', 'rgb(153, 116, 115)');
      });
  
      // Add center points
      const centerPoints = g.selectAll('.center-point')
      .data(polygonData.polygons)
      .enter()
      .append('circle')
      .attr('class', 'center-point')
      .attr('cx', d => data.points_dict[d.center_poly.point][0])
      .attr('cy', d => -data.points_dict[d.center_poly.point][1])
      .attr('r', 2)
      .style('fill', 'rgb(255, 221, 221)');
    //Append text element for polygon name
      centerPoints.each(function (d) {
        
        d3.select(this.parentNode)
          .append("text")
          .attr("x", data.points_dict[d.center_poly.point][0])
          .attr("y", -data.points_dict[d.center_poly.point][1] - 10)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(d.center_poly.name);
      });
      
    edges.style('pointer-events', 'none');
    centerPoints.style('pointer-events', 'none');
    svg.selectAll('text').style('pointer-events', 'none');

    // Initialize zoom behavior
    const zoom = d3.zoom()
      .on('zoom', zoomed);

    svg.call(zoom);
    if (zoomTransform) {
      svg.call(zoom.transform, zoomTransform);
    } else {
      // Otherwise, apply initial translation and scale
      svg.call(zoom.transform, d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 2 - 50).scale(2));
    }


    function handlePolygonClick(event, d) {
      // console.log(d.id,d.level);// Pass polygon ID to the parent component
      setNode(d.id);
      // Save current zoom transform state
      const now_zoom=d3.zoomTransform(svg.node())
      setZoomTransform(now_zoom);
      Tooltip.style("opacity", 0);
      sessionStorage.setItem("clickedId", d.id);
      sessionStorage.setItem("zoom",now_zoom.toString());
    }

    function zoomed(event) {
      g.attr('transform', event.transform);
      const now_zoom = d3.zoomTransform(svg.node());
      sessionStorage.setItem("zoom",now_zoom.toString());
    

    }

    function zoomed(event) {
      g.attr('transform', event.transform);

      const now_zoom=d3.zoomTransform(svg.node());
      sessionStorage.setItem("zoom",now_zoom.toString());
    }
    return () => {
      g.selectAll('*').remove();
      svg.on('.zoom', null);
      d3.selectAll(".tooltip").remove();
    };
  }, [data, svgWidth, svgHeight, node, zoomTransform]);

  return (

    <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>

  );
};

export default DrawPolygon;