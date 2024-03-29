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


const DrawPolygon = ({ data, svgWidth, svgHeight, onPolygonClick, ratingdata }) => {
  const svgRef = useRef();
  const [node, setNode] = useState('');


  const initial_zoom = sessionStorage.getItem("zoom") ? zoomTransformStringToObject(sessionStorage.getItem("zoom")) : null;
  console.log('initial zoom',initial_zoom);
  const [zoomTransform, setZoomTransform] = useState(initial_zoom); 
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const RedColorScale = d3.scaleSequential()
      .domain([0, d3.max(data.polygons, d => d.learning_value)]) // Reverse the domain
      .interpolator(d3.interpolate("rgb(212, 237, 255)", "rgb(0, 149, 255)")); // Interpolate colors from light red to lighter red // Interpolate colors from light blue to dark blue

    const OrangeColorScale = d3.scaleSequential()
      .domain([0, d3.max(data.polygons, d => d.learning_value)]) // Reverse the domain
      .interpolator(d3.interpolate("rgb(255, 241, 228)", "rgb(255, 128, 0)"));  // Interpolate colors from light orange to dark orange
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

    const mouseover = function (event, d) {
      Tooltip
        .style("opacity", 1)
        .html(d.name)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 36) + "px");
    }

    const polygons = polygonsGroup.selectAll('.polygon')
      .data(data.polygons)
      .enter()
      .append('polygon')
      .attr('class', 'polygon')
      .attr('points', d => {
        return d.region.map(vertexId => {
          const vertex = data.vertices_dict[vertexId];
          return `${vertex[0]},${-vertex[1]}`;
        }).join(' ');
      })
      .style('stroke', 'white') // Change stroke color if selected
      .style('stroke-width', '2')
      .style('fill', d => {
        if (d.level === 1 || d.level === 0) {

          return RedColorScale(d.learning_value);
        } else {
          return OrangeColorScale(d.learning_value);
        }
      })
      .on("mouseover", mouseover)
      .on('mousemove', function (event, d) {
        Tooltip
          .style("opacity", 1)
          .html(d.name)
          .style("left", (event.pageX + 20) + "px")
          .style("top", (event.pageY - 36) + "px");
        // console.log(event.pageX, event.pageY);
      })
      .on('mouseleave', function (d) {
        Tooltip.style("opacity", 0);
      });

    const edges = g.selectAll('.edge')
      .data(data.edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('x1', d => data.points_dict[d.from][0])
      .attr('y1', d => -data.points_dict[d.from][1])
      .attr('x2', d => data.points_dict[d.to][0])
      .attr('y2', d => -data.points_dict[d.to][1])
      .style('stroke', 'rgb(153, 116, 115)')
      .style('stroke-width', '1')
      .style('stroke-dasharray', '8,8');


    // Add center points for polygons with level 1
    const centerPoints = g.selectAll('.center-point')
      .data(data.polygons.filter(polygon => polygon.level === 1 || polygon.level === 0))
      .enter()
      .append('circle')
      .attr('class', 'center-point')
      .attr('cx', d => data.points_dict[d.point][0])
      .attr('cy', d => -data.points_dict[d.point][1])
      .attr('r', 2)
      .style('fill', 'rgb(213, 237, 255)');
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
    // Append text element for polygon name
    centerPoints.each(function (d) {

      d3.select(this.parentNode)
        .append("text")
        .attr("x", data.points_dict[d.point][0])
        .attr("y", -data.points_dict[d.point][1] - 10)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(d.name);
    });


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