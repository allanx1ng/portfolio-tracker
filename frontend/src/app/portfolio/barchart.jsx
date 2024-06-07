"use client"
import { Doughnut } from "react-chartjs-2"
import { useEffect, useRef, useState } from "react"
import "chart.js/auto"
import { useSearchParams } from "next/navigation"

const BarChart = ({assetData}) => {
    const chartRef = useRef(null);
    const [labels, setLabels] = useState([])
    const [values, setValues] = useState([])
    
    useEffect(() => {
        // Effect for handling window resize
        const handleResize = () => {
          const chart = chartRef.current;
          if (chart) {
            chart.resize(); // Resize the chart
          }
        };
    
        // Add event listener
        window.addEventListener('resize', handleResize);
    
        // Clean up
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      useEffect(() => {
        const tempLabels = []
        const tempValues = []
        assetData.forEach((e) => {
          tempLabels.push(e.asset_ticker)
          tempValues.push(parseFloat(e.current_value))
        })
        setLabels(tempLabels)
        setValues(tempValues)
      }, [assetData])
  // Chart data and configuration
  const data = {
    // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: labels,
    datasets: [
      {
        // data: [12, 19, 3, 5, 2, 3],
        data: values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderRadius: 10,
      },
    ],
  }

  const labelsPlugin = {
    id: 'labelsPlugin',
    afterDatasetsDraw(chart, args, options) {
      const { ctx, data, chartArea } = chart;
      const dataset = data.datasets[0];
      const total = dataset.data.reduce((sum, value) => sum + value, 0);
  
      ctx.save();
      ctx.font = options.font || '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
  
      dataset.data.forEach((value, index) => {
        // Calculate the percentage of each segment
        const percentage = ((value / total) * 100).toFixed(2) + '%';
        const element = chart.getDatasetMeta(0).data[index];
        const centerPoint = element.tooltipPosition();
        const textWidth = ctx.measureText(percentage).width;
  
        // Position the box slightly outside the chart
        const meta = chart.getDatasetMeta(0).data[index];
        const midAngle = (meta.startAngle + meta.endAngle) / 2;
        const radius = (meta.outerRadius - meta.innerRadius)/2;
        const position = {
          x: centerPoint.x + radius * Math.cos(midAngle),
          y: centerPoint.y + radius * Math.sin(midAngle)
        };
  
        // Draw the text box
        const padding = 5;
        const boxWidth = textWidth + padding * 2;
        const boxHeight = parseInt(ctx.font, 10) + padding * 2;
  
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(position.x - boxWidth / 2, position.y - boxHeight / 2, boxWidth, boxHeight);
  
        // Draw the text inside the box
        ctx.fillStyle = '#FFF';
        ctx.fillText(percentage, position.x, position.y);
      });
  
      ctx.restore();
    }
  };
  
  
  

  
  const options = {
    maintainAspectRatio: true,
    responsive: true,
    layout: {
      padding: 100,
    },
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
    
  }

  return <Doughnut ref={chartRef} data={data} options={options} plugins={[labelsPlugin]} />
}

export default BarChart
