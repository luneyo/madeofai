import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const InteractiveWordCloud = ({ words, width = 800, height = 500 }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '', value: 0 });

  useEffect(() => {
    if (!words || words.length === 0) return;

    // Clear previous svg content
    d3.select(svgRef.current).selectAll("*").remove();

    // Scale for font size - adjust domain based on your data range
    const maxVal = d3.max(words, d => d.value) || 1;
    const minVal = d3.min(words, d => d.value) || 0;
    
    const fontScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([20, 80]); // Min and max font size

    const layout = cloud()
      .size([width, height])
      .words(words.map(d => ({ text: d.text, size: fontScale(d.value), value: d.value })))
      .padding(5)
      .rotate(() => (~~(Math.random() * 2) * 90)) // 0 or 90 degrees
      .font("Inter")
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const text = svg.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Inter, sans-serif")
        .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text)
        .style("cursor", "pointer")
        .style("opacity", 0)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition().duration(200)
            .style("opacity", 1)
            .style("font-size", `${d.size * 1.1}px`)
            .style("filter", "drop-shadow(0 0 5px rgba(0,0,0,0.2))");
            
          setTooltip({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            text: d.text,
            value: d.value
          });
        })
        .on("mouseout", function(event, d) {
          d3.select(this)
            .transition().duration(200)
            .style("opacity", 0.8)
            .style("font-size", `${d.size}px`)
            .style("filter", "none");
            
          setTooltip(prev => ({ ...prev, visible: false }));
        });

      // Entrance animation
      text.transition()
        .duration(1000)
        .style("opacity", 0.8);
    }
  }, [words, width, height]);

  return (
    <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
      <svg ref={svgRef} style={{ overflow: 'visible' }} />
      {tooltip.visible && (
        <div style={{
          position: 'fixed',
          top: tooltip.y - 40,
          left: tooltip.x,
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          pointerEvents: 'none',
          fontSize: '14px',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontWeight: 600 }}>{tooltip.text}</span>
          <span style={{ marginLeft: '8px', opacity: 0.8 }}>{tooltip.value}</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveWordCloud;
