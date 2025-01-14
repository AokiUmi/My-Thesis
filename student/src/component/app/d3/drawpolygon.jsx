/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
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


const DrawPolygon = ({ initial_rating, mark, polygonData, vertexData, svgWidth, svgHeight, onPolygonClick }) => {
  const svgRef = useRef();
  const previousClickedGroup = sessionStorage.getItem("clickedGroup") ? JSON.parse(sessionStorage.getItem("clickedGroup")) : null;
  const [clickedGroup, setClickedGroup] = useState(previousClickedGroup);
  const now_chapter = JSON.parse(sessionStorage.getItem("chapter_id"));
  let initial_zoom = sessionStorage.getItem("zoom") ? zoomTransformStringToObject(sessionStorage.getItem("zoom")) : null;
  //  console.log(initial_zoom);
  const initial_clicked = sessionStorage.getItem("clickedId") ? JSON.parse(sessionStorage.getItem("clickedId")) : null;
  const [node, setNode] = useState(initial_clicked);
  const [zoomTransform, setZoomTransform] = useState(initial_zoom);
  let if_initial = false;
  let now_edgelist = [];
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Function to deepen the color
    const deepenColor = (originalColor) => {
      // Create a color object from the hexadecimal string
      const colorObj = d3.color(originalColor);
      // Darken the color by 0.5 (50%)
      const deepenedColor = colorObj.darker(0.5).toString();
      // Return the deepened color as a hexadecimal string
      return deepenedColor;
    };
    const colorScale = d3.scaleOrdinal()
      .domain([0, 1, 2])
      .range(['#C39EFF', '#C39EFF', '#E1E1E1']);
    // Filter polygons based on if_shown attribute

    const colorselect = (d) => {
      let color = '';
      if (d.if_self_marked === true && d.if_second_marked === true)
        color = "#FF9F6C";
      else if (d.if_self_marked || d.if_second_marked === true)
        color = "#FFDFAF";
      else color = colorScale(d.level);
      if (d.id === node)
        color = deepenColor(color);
      return color;
    };

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


    const groupSelection = g.selectAll('.group')
      .data(polygonData.polygons)
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
          const vertex = vertexData.vertices_dict[vertexId];
          return `${vertex[0]},${-vertex[1]}`;
        }).join(' '))
        .style('stroke', 'white') // Change stroke color if needed
        .style('opacity', (clickedGroup === groupData.group_id ? 1 : 0)) // Set opacity based on comparison
        .style('stroke-width', '2') // Adjust stroke width if needed
        .style('fill', colorselect) // Apply fill after stroke
        .on('click', function (event, d) {
          if (clickedGroup === groupData.group_id) {
            // console.log(d.id,d.level);// Pass polygon ID to the parent component
            setNode(d.id);
            // Save current zoom transform state
            const now_zoom = d3.zoomTransform(svg.node())
            setZoomTransform(now_zoom);
            Tooltip.style("opacity", 0);
            onPolygonClick(d.id, d.level);
            sessionStorage.setItem("clickedId", d.id);
            sessionStorage.setItem("zoom", now_zoom.toString());
          }
        }) // Handle click event
        .on('mouseover', function (event, d) {
          if (clickedGroup === groupData.group_id) {
            Tooltip
              .style("opacity", 1)
              .html(d.name)
              .style("left", (event.pageX + 20) + "px")
              .style("top", (event.pageY - 36) + "px");

          }

        }) // Handle mouseover event
        .on('mousemove', function (event, d) {
          if (clickedGroup === groupData.group_id) {
            Tooltip
              .style('opacity', 1)
              .html(d.name)
              .style('left', (event.pageX + 20) + 'px')
              .style('top', (event.pageY - 36) + 'px');

          }
        })
        .on('mouseleave', function (d) {
          Tooltip.style('opacity', 0);
        })
        .datum(d => d); // Bind data to each polygon
      // Draw center polygon
      group.append('polygon')
        .data(centerPoly)
        .attr('class', 'center-polygon')
        .attr("id", d => `polygon-${d.id}`)
        .attr('points', d => d.region.map(vertexId => {
          const vertex = vertexData.vertices_dict[vertexId];
          return `${vertex[0]},${-vertex[1]}`;
        }).join(' '))
        .style('stroke', 'white') // Change stroke color if needed
        .style('stroke-width', '2') // Adjust stroke width if needed
        .style('fill', colorselect) // Apply fill after stroke
        .on('click', (event, d) => {

          setNode(d.id);
          // Save current zoom transform state
          const now_zoom = d3.zoomTransform(svg.node())
          setZoomTransform(now_zoom);
          sessionStorage.setItem("zoom", now_zoom.toString());
          Tooltip.style("opacity", 0);
          now_edgelist = edges;
          sessionStorage.setItem("clickedGroup", groupData.group_id);
          setClickedGroup(groupData.group_id);
          sessionStorage.setItem("clickedId", d.id);
          onPolygonClick(d.id);
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
        })
        .datum(d => d); // Bind data to each polygon


    });
    
    // Function to add a new attribute to the polygon data
    function handleAddAttributeToPolygon(polygonId) {

      const polygon = d3.select(`#polygon-${polygonId}`); // Select the polygon by its unique ID
      if (!polygon.empty()) {
        const data = polygon.datum();
        if (data.level === 1 || data.level === 0) {
          polygon.datum(function (d) {
            // Add a new attribute to the data
            d.if_self_marked = true;
            return d;
          });
          polygon.style("fill", colorselect);
        }
        else if (data.level === 2) {

          polygon.datum(function (d) {
            // Add a new attribute to the data
            d.if_self_marked = true;
            return d;
          });
          polygon.style("fill", colorselect);
          const father = d3.select(`#polygon-${data.center_id}`);
          father.style("fill", "#FF9F6C");
          father.datum(function (d) {
            // Add a new attribute to the data
            d.if_second_marked = true;
            return d;
          });
          father.style("fill", colorselect);
        }


      }


    }

    if (!if_initial) {

      if (initial_rating !== null) {
        initial_rating.map((rating) => {
          handleAddAttributeToPolygon(rating.id);
        });
      }
      if_initial = true;
    }
    if (mark !== null) {
      handleAddAttributeToPolygon(mark);
    }
    const edges = g.selectAll('.edges')
      .data(now_edgelist)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('x1', d => vertexData.points_dict[d.from][0])
      .attr('y1', d => -vertexData.points_dict[d.from][1])
      .attr('x2', d => vertexData.points_dict[d.to][0])
      .attr('y2', d => -vertexData.points_dict[d.to][1])
      .style('stroke', 'rgb(153, 116, 115)')
      .style('stroke-width', '1');// Set opacity based on comparison

   
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

    edges.style('pointer-events', 'none');
    centerPoints.style('pointer-events', 'none');
    svg.selectAll('text').style('pointer-events', 'none');
    // Initialize zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.6, 4])
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

    function zoomed(event) {
      g.attr('transform', event.transform);
      const now_zoom = d3.zoomTransform(svg.node());
      sessionStorage.setItem("zoom", now_zoom.toString());
      g.selectAll('.arrow').remove();
       // Add arrows to the edges
      const arrowSize = getArrowSize(); // Size of the arrow
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
          .attr('class', 'arrow')
          .attr('points', `${newX2},${newY2} ${x3},${y3} ${x4},${y4}`)
          .style('fill', 'rgb(153, 116, 115)');
      });

      

      g.selectAll("text").remove();

      //Append text element for polygon name
      centerPoints.each(function (d) {

        d3.select(this.parentNode)
          .append("text")
          .attr("x", vertexData.points_dict[d.center_poly.point][0])
          .attr("y", d.group_id === 5 ? -vertexData.points_dict[d.center_poly.point][1] + 10 :-vertexData.points_dict[d.center_poly.point][1] - 10)
          .style('font-size', `${getTextSize()}px`)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
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
        return 22 / scalevalue;
      }
      if (scalevalue <= 0.66) return 12 / scalevalue;
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
      d3.selectAll(".tooltip").remove();
      svg.on('.zoom', null);

    };
  }, [polygonData, node, mark, svgHeight, svgWidth]);

  return (

    <svg ref={svgRef} width={svgWidth} height={svgHeight} />


  );
};

export default DrawPolygon;