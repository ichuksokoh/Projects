    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    } from 'chart.js';
import { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { ThemeContext } from '../context/ThemeContext';

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    export const Graph = ({ graphData } : {graphData : Number[][]}) => {
        const { theme } = useContext(ThemeContext)
        const saveOld = 'rgb(75,192,192)';

        const toolTipLabels = ["WPM", "RAW"];
        const data = {
            labels: graphData.map(i => i[0]),
            datasets: [
                {
                    data: graphData.map(i => i[1]),
                    label: 'WPM',
                    borderColor: theme.value.lineColor,
                    backgroundColor: theme.value.graphbg,
                    tension: 0.4,
                },
                {
                    data: graphData.map(i => i[2]),
                    label: 'RAW',
                    borderColor: theme.value.lineColor2,
                    backgroundColor: theme.value.graphbg,
                    tension: 0.4,
                },
            ]
        };


        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: true, 
                    mode: 'nearest' as const,
                    intersect: false, 
                    callbacks: {
                        label: function(tooltipItem: any) {
                            return `${toolTipLabels[tooltipItem.datasetIndex]}: ${Math.round(tooltipItem.raw)}`; // Customize the tooltip label
                        }
                    }
                },
                legend: {
                    labels: {
                        color: theme.value.lineColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: theme.value.lineColor,
                        maxRotation: graphData.length !== 0 && typeof graphData[0][0] === 'string' ? 40 : 0,
                        minRotation: graphData.length !== 0 && typeof graphData[0][0] === 'string' ? 40 : 0,
                    },
                    // grid: {
                    //     color: theme.value.lineColor
                    // }
                },
                y: {
                   ticks: {
                    color: theme.value.lineColor,
                    // stepSize: 50,
                   },
                //    grid: {
                //     color: theme.value.lineColor
                //    }
                }
            }
        }

        return (
            // <div className='w-full h-[200vh]'>
                <Line 
                    options={options} 
                    data={data}
                    height={'100%'}
                    width={'100%'}
                />
            //  </div>
        );
    };
