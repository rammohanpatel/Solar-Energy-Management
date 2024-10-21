"use client";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM'],
  datasets: [
    {
      label: 'Predicted Solar Production',
      data: [2, 4, 8, 12, 18, 20, 25, 30], // Predicted values
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false,
    },
    {
      label: 'Actual Solar Production',
      data: [1.5, 3.5, 6, 10, 15, 18, 22, 28], // Actual values
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Solar Production (kWh)',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Time (Hours)',
      },
    },
  },
};

export default function SolarChart() {
  return(
    <div className='flex justify-evenly lg:flex-row flex-col mt-20'>
  <div className='w-full lg:w-1/2'>
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Solar Production</h2>
      <div className="w-full h-[230px]">
        <Line data={data} options={options} />
      </div>
    </div>
  </div>

  <div className='w-full lg:w-1/2'>
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Energy Consumption</h2>
      <div className="w-full h-[230px]">
        <Line data={data} options={options} />
      </div>
    </div>
  </div>
</div>

  ) 
}

