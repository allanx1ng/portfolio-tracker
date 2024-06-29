import { percentGainCalc, percentPortfolioCalc, round } from "@/util/util"

export default function ({ data, tvl }) {
  //   console.log(data)
  //   console.log(tvl)
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-screen bg-base-200 shadow-md rounded my-6">
          <div className="grid grid-cols-6 uppercase text-sm leading-normal">
            <div className="py-3 px-6 text-center">Portfolio</div>
            <div className="py-3 px-6 text-center">Portfolio Value</div>
            <div className="py-3 px-6 text-center">Portfolio Value (%)</div>
            <div className="py-3 px-6 text-center">Contributions</div>
            <div className="py-3 px-6 text-center">PNL</div>
            <div className="py-3 px-6 text-center">Portfolio Type</div>
          </div>

          {data.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 text-sm font-light items-center justify-center"
            >
              <div className="flex items-center justify-center">
                <a
                  href={`/portfolios/${p.portfolio_name}`}
                  className="btn btn-outline btn-primary py-3 px-6 text-center m-2 w-32 min-h-8 h-10"
                >
                  {p.portfolio_name + "\n"}
                </a>
              </div>

              <div className="py-3 px-6 text-center">{round(p.tvl, 2)}</div>
              <div className="py-3 px-6 text-center">
                {round(percentPortfolioCalc(p.tvl, tvl), 2)}%
              </div>
              <div className="py-3 px-6 text-center">{round(p.contributions, 2)}</div>
              <div
                className={
                  p.tvl - p.contributions >= 0
                    ? "text-success py-3 px-6 text-center"
                    : "text-error py-3 px-6 text-center"
                }
              >
                ${round(p.tvl - p.contributions, 2)}
                {" / "}
                {round(percentGainCalc(p.tvl, p.contributions), 2)}%
              </div>
              <div className="py-3 px-6 text-center">{p.account_type}</div>
            </div>
          ))}

          <>
            <div className="grid grid-cols-6 uppercase text-sm leading-normal h-10 px-10 py-5">
              <div className="text-center col-span-2 justify-self-start">Asset</div>
              <div className="text-right justify-self-end">Portfolio Type</div>
              <div className="text-right justify-self-end">Contributions</div>
              <div className="text-center col-span-2 justify-self-end">Current Value / Gains</div>
            </div>

            {data.map((p, idx) => (
              <div
                key={idx}
                className="grid grid-cols-6 w-full rounded-full bg-white shadow-md justify-between items-center px-10 py-5"
              >
                <div className="flex items-center col-span-2">
                  <img src={""} alt={`Icon`} className="w-8 h-8 mr-4" />
                  <div>
                    <div className="font-semibold">{p.portfolio_name}</div>
                    <div className="text-sm text-gray-600">
                      {round(percentPortfolioCalc(p.tvl, tvl), 2)} % of total assets
                    </div>
                  </div>
                </div>
                <div className="text-sm justify-self-end">${round(p.contributions, 2)}</div>
                <div className="text-sm justify-self-end">${round(p.contributions, 2)}</div>
                <div className="flex justify-end justify-self-end col-span-2">
                  <div>
                    <div className="font-semibold text-right">${round(p.tvl, 2)}</div>
                    <div
                      className={
                        p.tvl - p.contributions > 0 ? "text-success text-sm" : "text-error text-sm"
                      }
                    >
                      ${round(p.tvl - p.contributions, 2)} (
                      {round(percentGainCalc(p.tvl, p.contributions), 2)}% )
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        </div>
      </div>
    </>
  )
}
