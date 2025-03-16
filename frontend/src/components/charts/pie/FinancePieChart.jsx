"use client"

import { ResponsivePie } from "@nivo/pie"
import { round } from "@/util/util"

const FinancePieChart = ({ data, totalSpending }) => {
  // Custom centered metric component for the pie chart
  const CenteredMetric = ({ centerX, centerY }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      className="font-semibold text-xl flex gap-10"
    >
      <tspan x={centerX} dy="-2rem">
        Total Spending:
      </tspan>
      <tspan x={centerX} dy="2rem" className="text-4xl">
        {`$${round(totalSpending, 2)}`}
      </tspan>
    </text>
  )
  
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      innerRadius={0.6}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={0}
      arcLinkLabelsTextColor={{ from: "color", modifiers: [["darker", 0.6]] }}
      theme={{
        labels: {
          text: {
            fontSize: "1rem",
            fontWeight: "semibold",
          },
        },
      }}
      arcLabelsSkipAngle={0}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 0.6]],
      }}
      arcLinkLabelsOffset={2}
      arcLinkLabelsColor={{
        from: "color",
      }}
      arcLinkLabelsThickness={3}
      animate={false}
      layers={["arcs", "arcLabels", "arcLinkLabels", CenteredMetric]}
      valueFormat={(value) => `$${Number(value).toString()}`}
      colors={{ scheme: "category10" }}
    />
  )
}

export default FinancePieChart
