declare module 'recharts' {
  import React from 'react';
  
  export interface TooltipProps {
    formatter?: (value: any, name?: string) => [string, string];
    labelFormatter?: (label: string) => string;
  }
  
  export class LineChart extends React.Component<any> {}
  export class Line extends React.Component<any> {}
  export class XAxis extends React.Component<any> {}
  export class YAxis extends React.Component<any> {}
  export class CartesianGrid extends React.Component<any> {}
  export class Tooltip extends React.Component<TooltipProps> {}
  export class Legend extends React.Component<any> {}
  export class ResponsiveContainer extends React.Component<any> {}
  export class AreaChart extends React.Component<any> {}
  export class Area extends React.Component<any> {}
  export class BarChart extends React.Component<any> {}
  export class Bar extends React.Component<any> {}
}
