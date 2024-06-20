import { round } from "@/util/util"

export default function ({ data }) {
  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-screen bg-base-200 shadow-md rounded my-6">
          <div className="grid grid-cols-6 uppercase text-sm leading-normal">
            <div className="py-3 px-6 text-center">Portfolio</div>
            <div className="py-3 px-6 text-center">Portfolio Value</div>
            <div className="py-3 px-6 text-center">Contributions</div>
            <div className="py-3 px-6 text-center">Net PNL</div>
            <div className="py-3 px-6 text-center">% PNL</div>
            <div className="py-3 px-6 text-center">Portfolio Provider/Type</div>
            {/* <div className="py-3 px-6 text-right">Delete</div> */}
          </div>

          
            {data.map((p, idx) => (
              <div key={idx} className="grid grid-cols-6 text-sm font-light items-center justify-center">
                <a href={`/portfolios/${p.portfolio_name}`} className="w-full py-3 px-6 text-center">
                  {p.portfolio_name + "\n"}
                </a>
                <div className="py-3 px-6 text-center">{round(p.tvl, 2)}</div>
                <div className="py-3 px-6 text-center">{round(p.tvl, 2)}</div>
                <div className="py-3 px-6 text-center">{round(p.tvl, 2)}</div>
                <div className="py-3 px-6 text-center">{round(p.tvl, 2)}</div>
                {/* <div>{p.account_type}</div> */}
              </div>
            ))}
          
        </div>
      </div>
    </>
  )
}
