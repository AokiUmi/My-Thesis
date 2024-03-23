/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef,useState } from 'react';
import * as d3 from 'd3';

const DrawPolygon = ({ polygonData, vertexData, svgWidth, svgHeight , onPolygonClick }) => {
  const svgRef = useRef();
  const [node, setNode] = useState('');
  const [zoomTransform, setZoomTransform] = useState(null); // State to store zoom transformation
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgCenterX = svgWidth / 2;
    const svgCenterY = svgHeight / 2;
    const colorScale = d3.scaleOrdinal()
      .domain([1, 2])
      .range(['rgb(247, 159, 159)','rgb(172, 225, 150)']);
      // Filter polygons based on if_shown attribute
    const shownPolygons = polygonData.polygons.filter(polygon => polygon.if_shown === true);
    const g = svg.append('g');
    // Append a group for polygons to ensure they are below other elements
    const polygonsGroup = g.append('g');

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
  
    const mouseover = function(event, d) {
        Tooltip
          .style("opacity", 1)
          .html("The name of the knowledge is: " + d.name)
          .style("left", (event.pageX + 20) + "px")
          .style("top", (event.pageY - 36) + "px");
      }

    const polygons = polygonsGroup.selectAll('.polygon')
      .data(shownPolygons)
      .enter()
      .append('polygon')
      .attr('class', 'polygon')
      .attr('points', d => {
        return d.region.map(vertexId => {
          const vertex = vertexData.vertices_dict[vertexId];
          return `${vertex[0]},${-vertex[1]}`;
        }).join(' ');
      })
      .style('stroke', 'white') // Change stroke color if selected
      .style('stroke-width', '2')
      .style('fill',  d => (d.id === node ? 'rgb(123, 181, 222)' : colorScale(d.level))) // Apply fill after stroke
      .on('click', handlePolygonClick) 
      .on("mouseover", mouseover )
      .on('mousemove', function (event, d) {
        Tooltip
          .style("opacity", 1)
          .html("The name of the knowledge is: " + d.name)
          .style("left", (event.pageX + 20) + "px")
          .style("top", (event.pageY - 36) + "px");
        // console.log(event.pageX, event.pageY);
      })
      .on('mouseleave', function (d) {
        Tooltip.style("opacity", 0);
      });
      const edges = g.selectAll('.edge')
      .data(polygonData.edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('x1', d => vertexData.points_dict[d.from][0])
      .attr('y1', d => -vertexData.points_dict[d.from][1])
      .attr('x2', d => vertexData.points_dict[d.to][0])
      .attr('y2', d => -vertexData.points_dict[d.to][1])
      .style('stroke', 'rgb(153, 116, 115)')
      .style('stroke-width', '1')
      .style('stroke-dasharray', '8,8');
      
    // Add center points for polygons with level 1
    const centerPoints = g.selectAll('.center-point')
      .data(shownPolygons.filter(polygon => polygon.level=== 1 || polygon.level=== 0 ))
      .enter()
      .append('circle')
      .attr('class', 'center-point')
      .attr('cx', d => vertexData.points_dict[d.point][0])
      .attr('cy', d => -vertexData.points_dict[d.point][1])
      .attr('r', 2)
      .style('fill', 'rgb(255, 221, 221)')
      
 
    
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
 
         // Calculate points for the arrowhead
         const x3 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
         const y3 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
         const x4 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
         const y4 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);
 
         // Draw arrowhead
         d3.select(this.parentNode)
             .append('polygon')
             .attr('points', `${x2},${y2} ${x3},${y3} ${x4},${y4}`)
             .style('fill', 'rgb(153, 116, 115)');
     });
    //Append text element for polygon name
    centerPoints.each(function (d) {
     
      d3.select(this.parentNode)
          .append("text")
          .attr("x", vertexData.points_dict[d.point][0])
          .attr("y", -vertexData.points_dict[d.point][1]-10)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(d.name);
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
        svg.call(zoom.transform, d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 2-60).scale(1));
      }
   
    function calculateHexagonPoints(centerX, centerY, sideLength) {
      let points = [];
      for (let i = 0; i < 6; i++) {
          let angle_deg = 60 * i;
          let angle_rad = Math.PI / 180 * angle_deg;
          let x = centerX + sideLength * Math.cos(angle_rad);
          let y = centerY + sideLength * Math.sin(angle_rad);
          points.push([x, y]);
      }
      return points;
  }
    function handlePolygonClick(event, d) {
      // console.log(d.id,d.level);// Pass polygon ID to the parent component
      setNode(d.id);
      // Save current zoom transform state
      setZoomTransform(d3.zoomTransform(svg.node()));
      Tooltip.style("opacity", 0);
      onPolygonClick(d.id);
    }

    function zoomed(event) {
      g.attr('transform', event.transform);
    }
    return () => {
      g.selectAll('*').remove();
      svg.on('.zoom', null);
  
    };
  }, [data, svgWidth, svgHeight,node, zoomTransform]);

  return (

       <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
  
  );
};

export default DrawPolygon;