import { percentGainCalc, percentPortfolioCalc, round } from "@/util/util"

import { wallets } from "@/util/Constants"

export default function ({ data, tvl }) {
    console.log(data)
  //   console.log(tvl)
  return (
    <>
      {/* <div className="overflow-x-auto transition-opacity duration-300 ease-in-out text-primary grid grid-cols-1 gap-2 py-4"> */}
      <div className="overflow-x-auto transition-opacity duration-300 ease-in-out grid grid-cols-1 gap-2 py-4 pb-8 bg-secondary p-8 my-8 rounded-3xl">
        {/* <div className="grid grid-cols-6 uppercase text-sm leading-normal">
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
          ))} */}

        <>
          <div className="grid grid-cols-7 uppercase leading-normal px-10 py-2 font-bold text-black">
            <div className="text-center col-span-2 justify-self-start">Portfolio Name</div>
            <div className="text-right justify-self-end">Portfolio Type</div>
            <div className="text-right justify-self-end">Num. Holdings</div>
            <div className="text-right justify-self-end">Contributions</div>
            <div className="text-center col-span-2 justify-self-end">Current Value / Gains</div>
          </div>

          {data.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-7 w-full rounded-full bg-white shadow-md justify-between items-center px-10 py-4 font-semibold"
            >
              <a className="flex items-center col-span-2" href={`/portfolios/${p.portfolio_name}`}>
                {p.account_type == "wallet" && <img src={wallets[p.provider].icon} alt={`Icon`} className="w-10 h-10 mr-4 rounded-full" />}
                <div>
                  <div className="font-bold">{p.portfolio_name}</div>
                  <div className="text-sm text-gray-600">
                    {round(percentPortfolioCalc(p.tvl, tvl), 2)} % of total assets
                  </div>
                </div>
              </a>
              <div className="text-sm justify-self-end">{p.account_type.toUpperCase()}</div>
              <div className="text-sm justify-self-end">{p.holdings}</div>
              <div className="text-sm justify-self-end">${round(p.contributions, 2)}</div>
              <div className="flex justify-end justify-self-end col-span-2">
                <div>
                  <div className="font-bold text-right">${round(p.tvl, 2)}</div>
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
      {/* </div> */}
    </>
  )
}
