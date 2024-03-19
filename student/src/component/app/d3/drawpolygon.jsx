/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef,useState } from 'react';
import * as d3 from 'd3';

const DrawPolygon = ({ data, svgWidth, svgHeight , onPolygonClick }) => {
  const svgRef = useRef();
  const [node, setNode] = useState('');
  const [zoomTransform, setZoomTransform] = useState(null); // State to store zoom transformation
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgCenterX = svgWidth / 2;
    const svgCenterY = svgHeight / 2;
    const colorScale = d3.scaleOrdinal()
      .domain([1, 2, 3])
      .range(['rgb(247, 159, 159)',  'rgb(255, 213, 170)','rgb(174, 223, 174)']);
      // Filter polygons based on if_shown attribute
    const shownPolygons = data.polygons.filter(polygon => polygon.if_shown === true);
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
  
    const mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
      }

    const polygons = polygonsGroup.selectAll('.polygon')
      .data(shownPolygons)
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
      .style('fill',  d => (d.id === node ? 'rgb(123, 181, 222)' : colorScale(d.color))) // Apply fill after stroke
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
      .data(data.edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('x1', d => data.points_dict[d.from][0])
      .attr('y1', d => -data.points_dict[d.from][1])
      .attr('x2', d => data.points_dict[d.to][0])
      .attr('y2', d => -data.points_dict[d.to][1])
      .style('stroke', 'rgb(133, 84, 84)')
      .style('stroke-width', '1')
      .style('stroke-dasharray', '5,5');

      
    // Add center points for polygons with level 1
    const centerPoints = g.selectAll('.center-point')
      .data(data.polygons.filter(polygon => polygon.color === 1))
      .enter()
      .append('circle')
      .attr('class', 'center-point')
      .attr('cx', d => data.points_dict[d.point][0])
      .attr('cy', d => -data.points_dict[d.point][1])
      .attr('r', 2)
      .style('fill', 'rgb(255, 221, 221)');
    
     // Filter text based on if_shown attribute
     const shownTexts = data.text.filter(text => text.if_shown === true);
    // Add text
    const texts = g.selectAll('.text')
      .data(shownTexts)
      .enter()
      .append('text')
      .attr('class', 'text')
      .attr('x', d => d.position[0])
      .attr('y', d => -d.position[1])
      .style('text-anchor', 'middle') // Center align the text horizontally
      .style('dominant-baseline', 'middle') // Center align the text vertically
      .style('font-size', d => d.size)
      .style('fill',d => d.color)
      .text(d => d.content);
    
      // Apply pointer-events to text, lines, and points to prevent interaction
    texts.style('pointer-events', 'none');
    edges.style('pointer-events', 'none');
    centerPoints.style('pointer-events', 'none');
    // Initialize zoom behavior
    const zoom = d3.zoom()
      .on('zoom', zoomed);

    svg.call(zoom);
    if (zoomTransform) {
      svg.call(zoom.transform, zoomTransform);
      } else {
        // Otherwise, apply initial translation and scale
        svg.call(zoom.transform, d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 2).scale(2));
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