import { PanelPlugin } from '@grafana/data';
import { ScatterOptions } from './types';
import { ScatterPanel } from './ScatterPanel';

export const plugin = new PanelPlugin<ScatterOptions>(ScatterPanel).setPanelOptions(builder => {
  return builder
    .addBooleanSwitch({
      path: 'formatAngle',
      name: 'Format Angle',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'unwrapDegrees',
      name: 'Unwrap Degrees',
      defaultValue: true,
    })
    .addColorPicker({
      path: 'color',
      name: 'Colour',
      defaultValue: 'dark-red',
    })
    .addRadio({
      path: 'seriesCountSize',
      defaultValue: 'sm',
      name: 'Series counter size',
      settings: {
        options: [
          {
            value: 'sm',
            label: 'Small',
          },
          {
            value: 'md',
            label: 'Medium',
          },
          {
            value: 'lg',
            label: 'Large',
          },
        ],
      },
      showIf: config => config.showSeriesCount,
    });
});
