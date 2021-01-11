import React from 'react';

// @ts-ignore
import { ColorDefinition, PanelProps, Vector, getColorForTheme, getColorName, getColorByName } from '@grafana/data';
import { ScatterOptions } from 'types';

import * as d3 from 'd3';
import { useTheme } from '@grafana/ui';

interface Props extends PanelProps<ScatterOptions> {}

interface Point {
  x: number;
  y: number;
}

function smod(x: number, m: number) {
  return x - Math.floor(x / m + 0.5) * m;
}

function unwrap(x: number[], m: number) {
  let yi = 0;
  const y = [];
  for (let i = 0; i < x.length; ++i) {
    yi += smod(x[i] - yi, m);
    y.push(yi);
  }
  return y;
}

export const ScatterPanel: React.FC<Props> = ({ options, data, width, height, timeZone }) => {
  const theme = useTheme();
  console.log(timeZone);

  const margin = { left: 50, top: 30, right: 30, bottom: 30 };

  const chartWidth = width - (margin.left + margin.right);
  const chartHeight = height - (margin.top + margin.bottom);

  let points: Point[] = [];

  if (data.series.length > 0) {
    const twdData = data.series[0];
    const time = twdData.fields.find(field => field.name === 'Time');
    const values = twdData.fields.find(field => field.name === 'Value');

    if (time && values) {
      let x = values.values.toArray() as number[];
      if (options.unwrapDegrees) {
        x = unwrap(x, 360);
      }

      const y = time.values as Vector<number>;
      console.log(twdData);

      for (let i = 0; i < twdData.length; i++) {
        points.push({ x: x[i] as number, y: y.get(i) });
      }
    }
  }

  console.log(`${points.length} points`);
  console.log(points);

  const xMin = d3.min(points, a => a.x) as number;
  const xMax = d3.max(points, a => a.x) as number;

  const yMin = d3.min(points, a => a.y) as number;
  const yMax = d3.max(points, a => a.y) as number;

  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, chartWidth]);

  const yScale = d3
    .scaleTime()
    .domain([yMin, yMax])
    .range([chartHeight, 0]);

  const xAxis = d3.axisBottom(xScale);

  if (options.formatAngle) {
    xAxis.tickFormat(a => {
      let deg = a as number;
      while (deg < 0) {
        deg = deg + 360;
      }
      const s = '000' + (deg % 360);
      return s.substr(s.length - 3) + '°';
    });
  }

  const timeFormat = d3.timeFormat('%H:%M:%S');
  const yAxis = d3.axisLeft(yScale).tickFormat(x => timeFormat(x as Date));

  console.log(options.color);
  const color = getColorForTheme(options.color, theme);
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <path
          ref={path => {
            d3.select(path)
              .datum(points)
              .attr('fill', 'none')
              .attr('stroke', color)
              .attr('stroke-width', 1)
              .attr(
                'd',
                d3
                  .line<Point>()
                  .x(d => xScale(d.x))
                  .y(d => yScale(d.y))
                  .curve(d3.curveBasis)
              );
          }}
        />

        <g
          transform={`translate(0, ${chartHeight})`}
          ref={node => {
            d3.select(node).call(xAxis as any);
          }}
        />
        <g
          ref={node => {
            d3.select(node).call(yAxis as any);
          }}
        />
      </g>
    </svg>
  );
};
