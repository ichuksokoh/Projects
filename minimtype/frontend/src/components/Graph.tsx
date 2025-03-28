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
            plugins: {
                title: {
                    display: true,
                    text: "",
                    color: theme.value.lineColor, 
                    font: {
                        size: 16,
                    }
                },
                tooltip: {
                    enabled: true, 
                    mode: 'nearest' as const,
                    intersect: false, // Shows the tooltip even if not directly over a point
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
                        maxRotation: typeof graphData[0][0] === 'string' ? 40 : 0,
                        minRotation: typeof graphData[0][0] === 'string' ? 40 : 0,
                    },
                    // grid: {
                    //     color: theme.value.lineColor
                    // }
                },
                y: {
                   ticks: {
                    color: theme.value.lineColor,
                    // stepsize: 40,
                   },
                //    grid: {
                //     color: theme.value.lineColor
                //    }
                }
            }
        }

        return (
            <div className='w-full h-full'>
                <Line options={options} data={data}/>
            </div>
        );
    };
