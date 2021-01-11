type SeriesSize = 'sm' | 'md' | 'lg';

export interface ScatterOptions {
  text: string;
  showSeriesCount: boolean;
  unwrapDegrees: boolean;
  formatAngle: boolean;
  seriesCountSize: SeriesSize;
  color: string;
}
