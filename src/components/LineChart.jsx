// import * as React from 'react';
// import { LineChart } from '@mui/x-charts/LineChart';

// export default function LineGraph({data}) {
//     console.log(data);
//     const values = [0];
//     const xData = [0];
//     data.forEach((item, index) => {values[index+1] = item.value; xData.push(index+1);});
//     console.log(values);

//   return (
//     <LineChart
//       width={500}
//       height={300}
//       series={[
//         { data: values },
//       ]}
//       xAxis={[{ scaleType: 'point', data: xData }]}
//       margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
//   grid={{ vertical: true, horizontal: true }}
//     />
//   );
// }

import * as React from 'react';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsGrid, ChartsYAxis } from '@mui/x-charts';

export default function LineGraph({data}) {
    console.log(data);
        const values = [0];
        const xData = [0];
        data.forEach((item, index) => {values[index+1] = item.value; xData.push(index+1);});
        console.log(values);
  return (
      
      <div className='h-[30rem]'>
        <ResponsiveChartContainer
          series={[
            {
              type: 'line',
              data: values,
            },
          ]}
          xAxis={[
            {
              data: xData,
              scaleType: 'point',
              showMark: true
            },
          ]}
        >
          <LinePlot />
          <ChartsGrid vertical horizontal />
          <ChartsXAxis  />
          <ChartsYAxis  />

        </ResponsiveChartContainer>
      </div>
  );
}