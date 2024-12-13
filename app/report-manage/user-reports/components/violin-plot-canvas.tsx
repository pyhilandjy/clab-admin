import Plot from 'react-plotly.js';
import { TokenziedSpeakerData } from '@/types/user_reports';

interface ViolinPlotProps {
  speakerData: TokenziedSpeakerData;
}

export default function ViolinPlot({ speakerData }: ViolinPlotProps) {
  const plotData: Partial<Plotly.ViolinData>[] = [
    {
      type: 'violin',
      y: speakerData.char_lengths,
      name: speakerData.speaker,
      box: { visible: true },
      meanline: { visible: true },
      line: { color: 'rgba(75, 192, 192, 1)' },
      fillcolor: 'rgba(75, 192, 192, 0.5)',
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    // title: `${speakerData.speaker}`,
    width: 450,
    height: 400,
    yaxis: {
      title: '문장길이',
      zeroline: true,
    },
    showlegend: false,
  };

  return <Plot data={plotData} layout={layout} config={{ staticPlot: true }} />;
}
