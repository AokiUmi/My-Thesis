/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef,useState,useContext } from 'react';
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

const DrawPolygon = ({ polygonData, vertexData, svgWidth, svgHeight , onPolygonClick }) => {
  const svgRef = useRef();
  const previousClickedGroup = sessionStorage.getItem("clickedGroup") ? JSON.parse(sessionStorage.getItem("clickedGroup")) : null;
  const [clickedGroup, setClickedGroup] = useState(previousClickedGroup);
  const initial_zoom = sessionStorage.getItem("zoom") ? zoomTransformStringToObject(sessionStorage.getItem("zoom")) : null;
  const [node, setNode] = useState(null);
  const [zoomTransform, setZoomTransform] = useState(initial_zoom);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const colorScale = d3.scaleOrdinal()
      .domain([0, 1, 2])
      .range(['#C39EFF','#C39EFF', '#E1E1E1']);
    // Filter polygons based on if_shown attribute
    const g = svg.append('g');

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
  
    const mouseover = function (event, d) {
      Tooltip
        .style("opacity", 1)
        .html( d.name)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 36) + "px");
    }
    const groupSelection = g.selectAll('.group')
      .data(polygonData.polygons)
      .enter().append('g')
      .attr('class', 'group')
      .attr('id', d => `group-${d.group_id}`); // Assign unique IDs based on center polygon ID

    groupSelection.each(function (groupData) {
    
      const group = d3.select(this);
      const centerPoly = groupData.center_poly;
      const level2Polygons = groupData.margin_polygons;
      const combinedEdges = [...groupData.edges.in_edges, ...groupData.edges.out_edges];

      // Draw level 2 polygons
      group.selectAll('.margin-polygon')
        .data(level2Polygons)
        .enter().append('polygon')
        .attr('class', 'margin-polygon')
        .attr('points', d => d.region.map(vertexId => {
          const vertex = vertexData.vertices_dict[vertexId];
          return `${vertex[0]},${-vertex[1]}`;
        }).join(' '))
        .style('stroke', 'white') // Change stroke color if needed
        .style('opacity',(clickedGroup === groupData.group_id ? 1 : 0)) // Set opacity based on comparison
        .style('stroke-width', '2') // Adjust stroke width if needed
        .style('fill', d => (d.id === node ? 'rgb(123, 181, 222)' : colorScale(d.level))) // Apply fill after stroke
        .on('click', handlePolygonClick) // Handle click event
        .on('mouseover', mouseover) // Handle mouseover event
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
        .attr('class', 'center-polygon')
        .attr('points', centerPoly.region.map(vertexId => {
          const vertex = vertexData.vertices_dict[vertexId];
          return `${vertex[0]},${-vertex[1]}`;
        }).join(' '))
        .style('stroke', 'white') // Change stroke color if needed
        .style('stroke-width', '2') // Adjust stroke width if needed
        .style('fill',(centerPoly.id === node ? 'rgb(123, 181, 222)' : colorScale(centerPoly.level))) // Apply fill after stroke
        .on('click', () => {
         
          setNode(centerPoly.id);
          // Save current zoom transform state
          const now_zoom=d3.zoomTransform(svg.node())
          setZoomTransform(now_zoom);
          Tooltip.style("opacity", 0);
   
          sessionStorage.setItem("clickedGroup", groupData.group_id);
          setClickedGroup(groupData.group_id);
          sessionStorage.setItem("clickedId", centerPoly.id);
          sessionStorage.setItem("zoom", now_zoom.toString());
          onPolygonClick(centerPoly.id,centerPoly.level);
        })
        .on('mouseover', function (event) {
          Tooltip
            .style("opacity", 1)
            .html( centerPoly.name)
            .style("left", (event.pageX + 20) + "px")
            .style("top", (event.pageY - 36) + "px");
        }) // Handle mouseover event
        .on('mousemove', function (event) {
          Tooltip
            .style('opacity', 1)
            .html(centerPoly.name)
            .style('left', (event.pageX + 20) + 'px')
            .style('top', (event.pageY - 36) + 'px');
        })
        .on('mouseleave', function () {
          Tooltip.style('opacity', 0);
        });
        const edges=group.selectAll('.edges')
        .data(combinedEdges)
        .enter()
        .append('line')
        .attr('class', 'edge')
        .attr('x1', d => vertexData.points_dict[d.from][0])
        .attr('y1', d => -vertexData.points_dict[d.from][1])
        .attr('x2', d => vertexData.points_dict[d.to][0])
        .attr('y2', d => -vertexData.points_dict[d.to][1])
        .style('stroke', 'rgb(153, 116, 115)')
        .style('stroke-width', '1')
        .style('opacity',(clickedGroup === groupData.group_id ? 1 : 0)); // Set opacity based on comparison
        
          // Add arrows to the edges
        const arrowSize = 5; // Size of the arrow
        edges.each(function (d) {
          const x1 = vertexData.points_dict[d.from][0];
          const y1 = -vertexData.points_dict[d.from][1];
          const x2 = vertexData.points_dict[d.to][0];
          const y2 = -vertexData.points_dict[d.to][1];

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
            .style('fill', 'rgb(153, 116, 115)')
            .style('opacity',(clickedGroup === groupData.group_id ? 1 : 0));
        });
        edges.style('pointer-events', 'none');
      
    });

  

    // Add center points
    const centerPoints = g.selectAll('.center-point')
    .data(polygonData.polygons)
    .enter()
    .append('circle')
    .attr('class', 'center-point')
    .attr('cx', d => vertexData.points_dict[d.center_poly.point][0])
    .attr('cy', d => -vertexData.points_dict[d.center_poly.point][1])
    .attr('r', 2)
         .style('fill', 'rgb(255, 221, 221)');
  //Append text element for polygon name
    centerPoints.each(function (d) {
      
      d3.select(this.parentNode)
        .append("text")
        .attr("x", vertexData.points_dict[d.center_poly.point][0])
        .attr("y", -vertexData.points_dict[d.center_poly.point][1] - 10)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(d.center_poly.name);
    });

    centerPoints.style('pointer-events', 'none');
    svg.selectAll('text').style('pointer-events', 'none');
    // Initialize zoom behavior
    const zoom = d3.zoom()
      .on('zoom', zoomed);

    svg.call(zoom);
    if (zoomTransform !== null) {
      // console.log(zoomTransform);
      // console.log(typeof zoomTransform);
      // console.log(zoomTransform.toString());
      
      svg.call(zoom.transform, zoomTransform);
    } else {
      // Otherwise, apply initial translation and scale
      svg.call(zoom.transform, d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 2).scale(1));
    }
    
    function handleCenterPolygonClick(event, d) {
      
      // console.log(d.id,d.level);// Pass polygon ID to the parent component
      setNode(d.id);
      // Save current zoom transform state
      const now_zoom=d3.zoomTransform(svg.node())
      setZoomTransform(now_zoom);
      Tooltip.style("opacity", 0);
      onPolygonClick(d.id,d.level);
      sessionStorage.setItem("clickedId", d.id);
      sessionStorage.setItem("zoom",now_zoom.toString());
    }
    
   

    function handlePolygonClick(event, d) {
      // console.log(d.id,d.level);// Pass polygon ID to the parent component
      setNode(d.id);
      // Save current zoom transform state
      const now_zoom=d3.zoomTransform(svg.node())
      setZoomTransform(now_zoom);
      Tooltip.style("opacity", 0);
      onPolygonClick(d.id,d.level);
      sessionStorage.setItem("clickedId", d.id);
      sessionStorage.setItem("zoom",now_zoom.toString());
    }

    function zoomed(event) {
      g.attr('transform', event.transform);
      const now_zoom=d3.zoomTransform(svg.node());
      sessionStorage.setItem("zoom",now_zoom.toString());

    }
    return () => {
      g.selectAll('*').remove();
      d3.selectAll(".tooltip").remove();
      svg.on('.zoom', null);
  
    };
  }, [polygonData, vertexData, svgWidth, svgHeight,node, zoomTransform]);

  return (

       <svg ref={svgRef} width={svgWidth} height={svgHeight} />
       
  
  );
};

export default DrawPolygon;