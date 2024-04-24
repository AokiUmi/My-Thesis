/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { edgeBundling } from './d3-ForceEdgeBundling';

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
const DrawPolygon = ({ nodeData, data, svgWidth, svgHeight}) => {
  const svgRef = useRef();
  let initial_zoom = sessionStorage.getItem("zoom") ? zoomTransformStringToObject(sessionStorage.getItem("zoom")) : null;
  const initial_clicked = sessionStorage.getItem("clickedId") ? JSON.parse(sessionStorage.getItem("clickedId")) : null;
  const [node, setNode] = useState(initial_clicked);
  const [zoomTransform, setZoomTransform] = useState(initial_zoom);
  let if_initial = false;
  let now_edgelist = [];
  const previousClickedGroup = sessionStorage.getItem("clickedGroup") ? JSON.parse(sessionStorage.getItem("clickedGroup")) : null;
  const [clickedGroup, setClickedGroup] = useState(previousClickedGroup);

  const nodes = nodeData, links = data.edge;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const min=Math.min(data.rating_range.center.min,data.rating_range.margin.min);
    const max= Math.max( data.rating_range.center.max,data.rating_range.margin.max);
    const PurpleColorScale = d3.scaleSequential()
      .domain([0, data.rating_range.center.max]) // Reverse the domain
      .interpolator(d3.interpolate("#EBDFFF", "#9250FF")); // Interpolate colors from light red to lighter red // Interpolate colors from light blue to dark blue

    const GreyColorScale = d3.scaleSequential()
      .domain([data.rating_range.margin.min, data.rating_range.margin.max]) // Reverse the domain
      .interpolator(d3.interpolate("#EEEEEE", "#9a9a9a"));  // Interpolate colors from light orange to dark orange
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
          .style('opacity', 1) // Set opacity based on comparison
          .style('stroke-width', '2') // Adjust stroke width if needed
          .style('fill', colorselect) // Apply fill after stroke
          .on('click', (event, d) => {
     
         
            // Save current zoom transform state
            const now_zoom = d3.zoomTransform(svg.node());
            setZoomTransform(now_zoom);
            sessionStorage.setItem("zoom", now_zoom.toString());
            sessionStorage.setItem("clickedGroup", groupData.group_id);
            setClickedGroup(groupData.group_id);
            now_edgelist = edges;
         
          
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

    
 
  
    const compatibility_threshold = 0.3;
    const bundling_stiffness = 0.5;
    const step_size = 0.5;
    const bundling = edgeBundling(
        { nodes, links },
        {
          compatibility_threshold,
          bundling_stiffness,
          step_size
        }
    );
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => -d.y);
  
    const bundling_edges = g.selectAll("path")
      .data(links)
      .join("path")
      .attr("d", (d) => lineGenerator(d.path))
      .attr("fill", "none")
      .style('stroke', "rgba(160, 153, 153, 0.4)")
      .style('stroke-width', '2')
      .style("opacity", clickedGroup === null ? 1 : 0.3);
 



    const edges=g.selectAll('.edges')
    .data(now_edgelist)
    .enter()
    .append('line')
    .attr('class', 'edge')
    .attr('x1', d => data.points_dict[d.source][0])
    .attr('y1', d => -data.points_dict[d.source][1])
    .attr('x2', d => data.points_dict[d.target][0])
    .attr('y2', d => -data.points_dict[d.target][1])
    .style('stroke', 'rgb(153, 116, 115)')
    .style('stroke-width', '1');// Set opacity based on comparison
    
    
    // Add center points
    const centerPoints = g.selectAll('.center-point')
    .data(data.polygons)
    .enter()
    .append('circle')
    .attr('class', 'center-point')
    .attr('cx', d => data.points_dict[d.center_poly.point][0])
    .attr('cy', d => -data.points_dict[d.center_poly.point][1])
    .attr('r', 2)
    .style('fill', 'rgb(255, 221, 221)');
 
      
    // edges.style('pointer-events', 'none');
    centerPoints.style('pointer-events', 'none');
    svg.selectAll('text').style('pointer-events', 'none');

    // Initialize zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.68, 4])
      .on('zoom', zoomed);

    svg.call(zoom);
    if (zoomTransform) {
      svg.call(zoom.transform, zoomTransform);
    } else {
      // Otherwise, apply initial translation and scale
      svg.call(zoom.transform, d3.zoomIdentity.translate(svgWidth / 2, svgHeight / 2 +40 ).scale(0.6));
    }

    function zoomed(event) {
      g.attr('transform', event.transform);
      const now_zoom = d3.zoomTransform(svg.node());
      sessionStorage.setItem("zoom", now_zoom.toString());
      g.selectAll('.arrow').remove();
      // Add arrows to the edges
      g.selectAll('.arrow').remove();
      // Add arrows to the edges
     const arrowSize = getArrowSize(); // Size of the arrow
     edges.each(function (d) {
       const x1 = data.points_dict[d.source][0];
       const y1 = -data.points_dict[d.source][1];
       const x2 = data.points_dict[d.target][0];
       const y2 = -data.points_dict[d.target][1];

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
         .attr('class', 'arrow')
         .attr('points', `${newX2},${newY2} ${x3},${y3} ${x4},${y4}`)
         .style('fill', 'rgb(153, 116, 115)');
     });

      
     g.selectAll("text").remove();
        //Append text element for polygon name
        centerPoints.each(function (d) {
      
        d3.select(this.parentNode)
          .append("text")
          .attr("x", data.points_dict[d.center_poly.point][0])
          .attr("y", d.group_id === 5 ? -data.points_dict[d.center_poly.point][1] + 10 :-data.points_dict[d.center_poly.point][1] - 10)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style('font-size', `${getTextSize()}px`)
          .text(d.center_poly.name);
      });

     svg.selectAll('text').style('pointer-events', 'none');
     svg.selectAll('.arrow').style('pointer-events', 'none');
    

    }

    function getScaleValue() {
      const zoom1 = sessionStorage.getItem('zoom');
      // Regular expression to find scale value
      const scaleRegex = /scale\(([^)]+)\)/;
      // Extract scale value using regex
      const matches = zoom1.match(scaleRegex);
      // matches[1] should contain the scale value if it is found
      const scaleValue = matches && matches[1] ? parseFloat(matches[1]) : null;
      return scaleValue;
    }
    
    // TODO: tune this function
    function getTextSize() {
      const scalevalue = getScaleValue();
      if (scalevalue >= 4) {
        return 28 / scalevalue;
      }
      if (scalevalue <= 0.79) return 11.5 / scalevalue;
      return 18 / scalevalue;
    }
    
    // TODO: tune this function
    function getArrowSize() {
      const scalevalue = getScaleValue();
      if (scalevalue >= 4) {
        return 24 / scalevalue;
      }
      if (scalevalue <= 0.66) return 10 / scalevalue;
      return 15 / scalevalue;
    }

   
    return () => {
      g.selectAll('*').remove();
      svg.on('.zoom', null);
      d3.selectAll(".tooltip").remove();
    };
  }, [data, svgWidth, svgHeight, node, zoomTransform,clickedGroup]);

  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
     
    </div>
    

  );
};

export default DrawPolygon;