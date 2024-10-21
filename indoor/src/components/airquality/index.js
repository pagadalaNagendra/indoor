import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const CombinedChartsWithCO2Peaks = () => {
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [time1, setTime1] = useState(0);
    const [time2, setTime2] = useState(0);
    const [waveData1, setWaveData1] = useState(Array(50).fill(50));
    const [waveData2, setWaveData2] = useState(Array(50).fill(50));
    const [humidityFlowData1, setHumidityFlowData1] = useState(Array(50).fill(50));
    const [humidityFlowData2, setHumidityFlowData2] = useState(Array(50).fill(50));
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);

    useEffect(() => {
        fetchData();
        const fetchInterval = setInterval(fetchData, 5000);
        const animationInterval = setInterval(animate, 100);
        return () => {
            clearInterval(fetchInterval);
            clearInterval(animationInterval);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("https://smartcitylivinglab.iiit.ac.in/verticals/all/latest/");
            const jsonData = await response.json();
            const nodeData1 = jsonData.sr_aq.find(node => node.node_id === 'SR-AQ-KH95-00');
            const nodeData2 = jsonData.sr_aq.find(node => node.node_id === 'SR-AQ-KH95-02');
            setData1(nodeData1);
            setData2(nodeData2);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const animate = () => {
        setTime1(t => t + 0.1);
        setTime2(t => t + 0.1);
        
        if (data1 && data2) {
            const humidity1 = parseFloat(data1.relative_humidity);
            const humidity2 = parseFloat(data2.relative_humidity);

            setWaveData1(prev => [humidity1 + Math.sin(time1 * 0.1) * 2.5, ...prev.slice(0, -1)]);
            setWaveData2(prev => [humidity2 + Math.cos(time2 * 0.1) * 2.5, ...prev.slice(0, -1)]);
            setHumidityFlowData1(prev => [humidity1 + Math.sin(time1 * 0.1) * 2.5, ...prev.slice(0, -1)]);
            setHumidityFlowData2(prev => [humidity2 + Math.cos(time2 * 0.1) * 2.5, ...prev.slice(0, -1)]);
        }
    };

    const detectPeaks = (data) => {
        let peaks = [];
        for (let i = 1; i < data.length - 1; i++) {
            if ((data[i] > data[i - 1] && data[i] > data[i + 1]) || 
                (data[i] < data[i - 1] && data[i] < data[i + 1])) {
                peaks.push({ value: data[i], index: i });
            }
        }
        return peaks;
    };

    const filterPeaks = (peaks, threshold) => {
        return peaks.filter(peak => Math.abs(peak.value) > threshold);
    };

    const createTemperatureChartData = (data, time, color) => {
        if (!data) return null;

        const simulatedData = Array.from({ length: 50 }, (_, i) => {
            const offset = i - 25;
            return parseFloat(data.temperature) + (Math.sin(time * 4 + offset) ** 3) * 2;
        });

        const peaks = detectPeaks(simulatedData);
        const filteredPeaks = filterPeaks(peaks, 1.5); // Adjust the threshold as needed

        const peakValues = filteredPeaks.map(peak => peak.value).reverse();
        const peakLabels = filteredPeaks.map(peak => `Time ${peak.index + 1}`).reverse();

        return {
            labels: peakLabels.length ? peakLabels : simulatedData.map((_, i) => `Time ${i + 1}`),
            datasets: [{
                label: `Temperature (°C) - ${data.node_id}`,
                data: peakValues.length ? peakValues : simulatedData,
                borderColor: color,
                backgroundColor: color.replace('1)', '0.3)'),
                fill: true,
                tension: 0.1,
                borderWidth: 2,
                pointRadius: 0,
            }]
        };
    };

    const createHumidityChartData = (data, flowData, color) => {
        if (!data) return null;

        const peaks = detectPeaks(flowData);
        const filteredPeaks = filterPeaks(peaks, 1.5); // Adjust the threshold as needed

        const peakValues = filteredPeaks.map(peak => peak.value).reverse();
        const peakLabels = filteredPeaks.map(peak => `Time ${peak.index + 1}`).reverse();

        return {
            labels: peakLabels.length ? peakLabels : Array.from({ length: 50 }, (_, i) => (i + 1).toString()),
            datasets: [{
                label: `Humidity - ${data.node_id}`,
                data: peakValues.length ? peakValues : flowData,
                borderColor: color,
                backgroundColor: color.replace('1)', '0.3)'),
                fill: true,
                tension: 0.4,
            }]
        };
    };

    const createCO2ChartData = (data, time, color) => {
        if (!data) return null;

        const simulatedData = Array.from({ length: 50 }, (_, i) => {
            const offset = i - 25;
            return parseFloat(data.co2) + (Math.sin(time * 4 + offset) ** 3) * 2;
        });

        const peaks = detectPeaks(simulatedData);
        const filteredPeaks = filterPeaks(peaks, 1.5); // Adjust the threshold to reduce peaks

        const peakValues = filteredPeaks.map(peak => peak.value).reverse();
        const peakLabels = filteredPeaks.map(peak => `Time ${peak.index + 1}`).reverse();

        return {
            labels: peakLabels,
            datasets: [
                {
                    label: `CO2 (ppm) - ${data.node_id}`,
                    data: peakValues,
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.3)'),
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 5, // Highlight peak points
                    pointHoverRadius: 7,
                }
            ]
        };
    };

    const options = {
        responsive: true,
        animation: { duration: 0 },
        scales: {
            x: { title: { display: true, text: 'Time', color: 'white' } },
            y: { title: { display: true, text: 'Value', color: 'white' } }
        },
        plugins: {
            legend: { display: true, labels: { color: 'white' } },
            datalabels: {
                display: true,
                color: 'white',
                align: 'top',
                anchor: 'end',
                formatter: (value) => value.toFixed(2),
            }
        }
    };

    const renderChartRow = (nodeData, time, waveData, humidityFlowData, color) => {
        if (!nodeData) return null;

        const tempChartData = createTemperatureChartData(nodeData, time, color);
        const humidityChartData = createHumidityChartData(nodeData, humidityFlowData, color);
        const co2ChartData = createCO2ChartData(nodeData, time, color);

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '30%' }}>
                    <h3 className='temp' style={{ color: 'white' }}>Temperature - {nodeData.node_id}</h3>
                    <Line data={tempChartData} options={options} />
                </div>
                <div style={{ width: '30%' }}>
                    <h3 style={{ color: 'white' }}>Humidity - {nodeData.node_id}</h3>
                    <Line data={humidityChartData} options={options} />
                </div>
                <div style={{ width: '30%' }}>
                    <h3 style={{ color: 'white' }}>CO2 - {nodeData.node_id}</h3>
                    <Line data={co2ChartData} options={options} />
                </div>
            </div>
        );
    };

    return (
        <div style={{ width: '97%', margin: '0 auto', backgroundColor: '#1c1c1c', padding: '20px' }}>
            {renderChartRow(data1, time1, waveData1, humidityFlowData1, 'rgba(255, 99, 132, 1)')}
            {renderChartRow(data2, time2, waveData2, humidityFlowData2, 'rgba(54, 162, 235, 1)')}
        </div>
    );
};

export default CombinedChartsWithCO2Peaks;
