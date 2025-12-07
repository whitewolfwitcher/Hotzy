"use client";

import React from 'react';

const performanceData = [
  { name: 'Morning Coffee', mug4090Value: 1.0, mug5090Value: 1.4 },
  { name: 'Afternoon Tea', mug4090Value: 0.9, mug5090Value: 1.3 },
  { name: 'Hot Chocolate', mug4090Value: 1.0, mug5090Value: 2.3 },
  { name: 'Iced Latte', mug4090Value: 1.0, mug5090Value: 2.1 },
  { name: 'Espresso Shot', mug4090Value: 1.0, mug5090Value: 2.4 },
  { name: 'Herbal Infusion', mug4090Value: 0.95, mug5090Value: 2.0 },
  { name: 'Chai Latte', mug4090Value: 1.0, mug5090Value: 2.5 },
  { name: 'Matcha', mug4090Value: 0.85, mug5090Value: 1.3 },
  { name: 'Americano', mug4090Value: 1.0, mug5090Value: 2.6 },
  { name: 'Cappuccino', mug4090Value: 0.9, mug5090Value: 2.1 },
];

const LegendItem = ({ colorClass, text }: { colorClass: string; text: string }) => (
  <div className="flex items-center">
    <div className={`w-3 h-3 ${colorClass} mr-2`}></div>
    <span className="text-sm text-muted-foreground">{text}</span>
  </div>
);

const PerformanceChart = () => {
    const SVG_WIDTH = 1200;
    const SVG_HEIGHT = 500;
    const Y_AXIS_WIDTH = 60;
    const X_AXIS_HEIGHT = 50;
    const TOP_PADDING = 20;

    const plotWidth = SVG_WIDTH - Y_AXIS_WIDTH;
    const plotHeight = SVG_HEIGHT - X_AXIS_HEIGHT - TOP_PADDING;
    const PLOT_Y_START = TOP_PADDING;

    const MAX_Y_VALUE = 3;

    const scaleY = (value: number) => PLOT_Y_START + plotHeight - (value / MAX_Y_VALUE) * plotHeight;
    
    const yAxisLabels = [
        { value: 0, label: '0' },
        { value: 1, label: '1X' },
        { value: 2, label: '2X' },
    ];

  return (
    <section className="bg-card text-card-foreground py-24" id="performances">
      <div className="container mx-auto px-8">
        <h2 className="text-5xl font-normal text-center text-white mb-16">
          Performances
        </h2>
        <div className="relative">
          <div className="absolute top-0 right-0 flex flex-col space-y-2">
            <LegendItem colorClass="bg-primary" text="Mug 5090" />
            <LegendItem colorClass="bg-muted" text="Mug 4090" />
          </div>

          <div style={{ height: '500px' }} className="w-full">
            <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
              
              {yAxisLabels.map((item) => (
                <g key={item.value}>
                  <line
                    x1={Y_AXIS_WIDTH}
                    y1={scaleY(item.value)}
                    x2={SVG_WIDTH}
                    y2={scaleY(item.value)}
                    stroke="var(--color-border)"
                    strokeWidth="1"
                  />
                  <text
                    x={Y_AXIS_WIDTH - 15}
                    y={scaleY(item.value) + 5}
                    textAnchor="end"
                    className="text-sm"
                    fill="var(--color-muted-foreground)"
                  >
                    {item.label}
                  </text>
                </g>
              ))}
              
              {performanceData.map((data, index) => {
                const groupWidth = plotWidth / performanceData.length;
                const barWidth = 28;
                const groupX = Y_AXIS_WIDTH + index * groupWidth;
                const barGroupX = groupX + (groupWidth - barWidth * 2) / 2;

                const mug4090Height = (data.mug4090Value / MAX_Y_VALUE) * plotHeight;
                const mug5090Height = (data.mug5090Value / MAX_Y_VALUE) * plotHeight;
                
                return (
                  <g key={data.name}>
                    <rect
                      x={barGroupX}
                      y={PLOT_Y_START + plotHeight - mug4090Height}
                      width={barWidth}
                      height={mug4090Height}
                      fill="var(--color-chart-2)"
                    />
                    <rect
                      x={barGroupX + barWidth}
                      y={PLOT_Y_START + plotHeight - mug5090Height}
                      width={barWidth}
                      height={mug5090Height}
                      fill="var(--color-chart-1)"
                    />
                    <text
                      x={groupX + groupWidth / 2}
                      y={SVG_HEIGHT - X_AXIS_HEIGHT + 25}
                      textAnchor="middle"
                      className="text-xs"
                      fill="var(--color-muted-foreground)"
                    >
                      {data.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-caption mt-8 max-w-4xl mx-auto">
          Relative Performance. Tested with a Mug 5090 vs a Mug 4090. Mugs filled with standard 8oz beverage at 180°F. Performance measured by thermal retention over 30 minutes in a controlled 72°F environment. Results may vary based on beverage type, initial temperature, and ambient conditions.
        </p>
      </div>
    </section>
  );
};

export default PerformanceChart;