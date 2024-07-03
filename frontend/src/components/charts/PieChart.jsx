"use client"
import { ResponsivePie } from "@nivo/pie"
import { useEffect, useState } from "react"
import { percentPortfolioCalc, round } from "@/util/util"
import { usePortfolio } from "@/context/TotalAssetContext"
import { useSpring, animated } from "@react-spring/web"

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsivePie = ({state}) => {
  const { data, tvl } = usePortfolio()
//   const state = "percent"
  //   console.log(data)

  const [displayData, setDisplayData] = useState([])
  useEffect(() => {
    processData()
  }, [data])

  const processData = () => {
    let totalAmt = 0
    let totalPercentage = 0
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      //   console.log(item)
      if (totalPercentage > 90) {
        displayData[i] = {
          id: "Other",
          label: "Other",
          value: state == "dollar" ? round(tvl - totalAmt, 0) : round(100 - totalPercentage, 2),
        }
        break
      }
      totalPercentage += round(percentPortfolioCalc(item.current_value, tvl), 2)
      totalAmt += Number(item.current_value)
      displayData[i] = {
        id: item.asset_name,
        label: item.asset_ticker,
        value:
          state == "dollar"
            ? round(item.current_value, 0)
            : round(percentPortfolioCalc(item.current_value, tvl), 2),
      }
    }
  }

  return (
    <ResponsivePie
      data={displayData}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      innerRadius={0.5}
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
      //   arcLinkLabelsThickness={2}
      //   arcLinkLabelsColor={{ from: "color" }}
      //   arcLabelsTextColor={{
      //     from: "color",
      //     modifiers: [["darker", 0.6]],
      //   }}
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
      arcLabelsComponent={({ datum, label, style }) => (
        <animated.g
          transform={style.transform}
          style={{
            pointerEvents: "none",
          }}
        >
          <circle fill={style.textColor} cy={4} r={30} />
          <circle fill="#ffffff" stroke={datum.color} strokeWidth={2} r={30} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={style.textColor}
            className="font-bold text-sm"
            // style={{
            //   fontSize: 14,
            //   fontWeight: 800,
            // }}
          >
            {label}
          </text>
        </animated.g>
      )}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      // fill={[
      //   {
      //     match: {
      //       id: "ruby",
      //     },
      //     id: "dots",
      //   },
      //   {
      //     match: {
      //       id: "c",
      //     },
      //     id: "dots",
      //   },
      //   {
      //     match: {
      //       id: "go",
      //     },
      //     id: "dots",
      //   },
      //   {
      //     match: {
      //       id: "python",
      //     },
      //     id: "dots",
      //   },
      //   {
      //     match: {
      //       id: "scala",
      //     },
      //     id: "lines",
      //   },
      //   {
      //     match: {
      //       id: "lisp",
      //     },
      //     id: "lines",
      //   },
      //   {
      //     match: {
      //       id: "elixir",
      //     },
      //     id: "lines",
      //   },
      //   {
      //     match: {
      //       id: "javascript",
      //     },
      //     id: "lines",
      //   },
      // ]}
      // legends={[
      //   {
      //     anchor: "bottom",
      //     direction: "row",
      //     justify: false,
      //     translateX: 0,
      //     translateY: 56,
      //     itemsSpacing: 0,
      //     itemWidth: 100,
      //     itemHeight: 18,
      //     itemTextColor: "#999",
      //     itemDirection: "left-to-right",
      //     itemOpacity: 1,
      //     symbolSize: 18,
      //     symbolShape: "circle",
      //     effects: [
      //       {
      //         on: "hover",
      //         style: {
      //           itemTextColor: "#000",
      //         },
      //       },
      //     ],
      //   },
      // ]}

      valueFormat={(value) =>
        state == "dollar" ? `$${Number(value).toString()}` : `${Number(value).toString()}%`
      }
    />
  )
}

export default MyResponsivePie
