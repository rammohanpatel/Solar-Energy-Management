"use client";
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 6,
      },
    },
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          xMin: 0,
          xMax: 0,
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
};

export default function SolarChart() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://luminous-bsd7.onrender.com/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3600000); // Fetch every hour

    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;
  if (!data) return <div className="text-center mt-20">Loading...</div>;

  const currentHour = new Date().getHours();
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = (currentHour + i) % 24;
    return `${hour}:00`;
  });

  const scaledSolarData = data.predict_solar_power.map(value => value / 100);
  const scaledActualSolarData = data.actual_solar_power.map(value => value / 100);

  const lastActualDataIndex = data.actual_solar_power.findLastIndex(value => value !== null);

  const createChartData = (predictedData, actualData, label) => ({
    labels: hours,
    datasets: [
      {
        label: `Predicted ${label}`,
        data: predictedData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: `Actual ${label}`,
        data: actualData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  });

  const solarData = createChartData(scaledSolarData, scaledActualSolarData, 'Solar Production');
  const consumptionData = createChartData(data.predict_consumption, data.actual_consumption, 'Consumption');
  const priceData = createChartData(data.predict_price, data.actual_price, 'Price');

  const createOptions = (yAxisTitle, formatCallback = null) => ({
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: { display: true, text: yAxisTitle },
        ticks: formatCallback ? { callback: formatCallback } : {}
      }
    },
    plugins: {
      ...commonOptions.plugins,
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: lastActualDataIndex,
            xMax: lastActualDataIndex,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
          }
        }
      }
    }
  });

  const solarOptions = createOptions('Solar Production (x100)');
  const consumptionOptions = createOptions('Energy Consumption');
  const priceOptions = createOptions('Energy Price', (value) => '$' + value.toFixed(2));

  // Hourly savings data
  const savings = [5.31, 8.44, 7.42, 7.27, 15.21, 9.29, 10.36, 11.93, 6.73, 6.10, 6.32, 6.41];
  const totalSaving = savings.reduce((acc, curr) => acc + curr, 0);

  const lastSavingHourIndex = savings.length - 1;
  const savingsHours = hours.slice(0, lastSavingHourIndex + 1);

  const savingsData = {
    labels: savingsHours,
    datasets: [{
      label: 'Hourly Savings',
      data: savings,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const savingsOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        title: { display: true, text: 'Savings ($)' },
      }
    },
    plugins: {
      ...commonOptions.plugins,
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: Math.min(Math.floor(Date.now() / 3600000) % 24, lastSavingHourIndex),
            xMax: Math.min(Math.floor(Date.now() / 3600000) % 24, lastSavingHourIndex),
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
          }
        }
      }
    }
  };

  return(
    <div className='container mx-auto px-4 mt-10'>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Energy Dashboard</h1>
      <div className='flex flex-col gap-8'>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100">Solar Production</h2>
          <div className="p-4 h-[500px]">
            <Line data={solarData} options={solarOptions} />
          </div>
        </div>

        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100">Energy Consumption</h2>
          <div className="p-4 h-[500px]">
            <Line data={consumptionData} options={consumptionOptions} />
          </div>
        </div>

        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100">Energy Price</h2>
          <div className="p-4 h-[500px]">
            <Line data={priceData} options={priceOptions} />
          </div>
        </div>

        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <h2 className="text-xl font-semibold text-gray-800 p-4 bg-gray-100">Hourly Savings</h2>
          <div className="p-4 h-[500px]">
            <Bar data={savingsData} options={savingsOptions} />
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">Total Savings: ${totalSaving.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  ) 
}
