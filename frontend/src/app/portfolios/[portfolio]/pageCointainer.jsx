"use client"
import { useState, useEffect, Fragment } from "react"
import AddAssets from "./addAssets"
import EditButton from "./EditButton"
import DeletePortfolio from "./DeletePortfolio"
import { round, percentGainCalc } from "@/util/util"
import AssetTable from "@/components/tables/AssetTable"
import EditAssets from "./EditAssets"
import AddAssetButton from "./AddAssetButton"
import ErrorCode from "@/components/ErrorCode"
import { usePortfolio } from "@/context/IndividualPortfolioAssetContext"
import ChartProcessing from "./ChartProcessing"
import { wallets } from "@/util/Constants"

export default function ({ params }) {
  const { portfolio, data, loading, error, setReload } = usePortfolio()
  const [edit, setEdit] = useState(false)
  const [addAsset, setAddAsset] = useState(false)
  const [tvl, setTvl] = useState(0)
  const [contributions, setContributions] = useState(0)
  useEffect(() => {
    setContributions(portfolio.contributions)
    setTvl(portfolio.tvl)
  }, [portfolio])

  if (loading) return <span className="loading loading-dots loading-md"></span>
  if (error) return <ErrorCode error={error} />

  console.log(portfolio)

  return (
    <div className="bg-white text-black">
      <h1 className="mt-8 text-black">Portfolio: {params.portfolio}</h1>
      {/* {portfolio.portfolio_data.account_type == "wallet" && (
        <div className="flex items-center align-baseline gap-x-2 my-4">
          <img
            src={wallets[portfolio.portfolio_data.provider].icon}
            alt={`Icon`}
            className="w-10 h-10 mr-4 rounded-full"
          />
          <div> Wallet address: {portfolio.portfolio_data.wallet_address}</div>
        </div>
      )} */}
      {/* <h3>{portfolio.portfolio_data.account_type}</h3> */}

      {data.length == 0 ? (
        <ErrorCode error={204} text={"No assets in this portfolio, add some to get started!"} />
      ) : (
        <>
          <div className="grid w-full grid-cols-1 lg:grid-cols-2 py-8 gap-8 h-600px">
            <div className="w-full min-h-1/2 bg-white rounded-3xl flex items-center justify-center col-span-2">
              {/* <BarChart assetData={data} /> */}
              <ChartProcessing />
            </div>
          </div>
          <div>
            {/* <div className="stats stats-vertical lg:stats-horizontal shadow my-8 bg-secondary text-primary"> */}
            {/* <h2 className="stat">Portfolio Stats:</h2> */}
            <div className="divider divider-primary"></div>
            <div className="flex justify-start">
              <div className="stat">
                <div className="stat-title text-primary">Net contibutions:</div>
                <div className="stat-value text-3xl">${round(contributions, 2)}</div>
              </div>

              <div className="stat">
                <div className="stat-title text-primary">Net PNL</div>
                <div
                  className={
                    tvl - contributions >= 0
                      ? "stat-value text-3xl text-success"
                      : "stat-value text-3xl text-error"
                  }
                >
                  ${round(tvl - contributions, 2)}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title text-primary">Net PNL (%)</div>
                <div
                  className={
                    tvl - contributions >= 0
                      ? "stat-value text-3xl text-success"
                      : "stat-value text-3xl text-error"
                  }
                >
                  {round(percentGainCalc(tvl, contributions), 2)}%
                </div>
              </div>
            </div>
          </div>
          <div className="divider divider-primary"></div>
          {/* </div> */}

          <div className="my-8">
            <div className="my-8 px-8 py-4 rounded-3xl bg-secondary">
              <div className="relative">
                {edit && (
                  <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
                    <EditAssets
                      // data={data}
                      // setReload={setReload}
                      portfolio_name={params.portfolio}
                      setEdit={setEdit}
                    />
                  </div>
                )}
                <div
                  className={`transition-opacity duration-300 ease-in-out ${
                    edit ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <>
                    <AssetTable data={data} tvl={portfolio.tvl} />
                  </>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="divider divider-primary"></div>

            <h2>Stats:</h2>

            <div className="grid grid-cols-4 rounded-3xl py-2 px-4 gap-x-8">
              <div>
                <div className="divider divider-secondary"></div>
                <div>Portfolio worth:</div>
                <div className="font-bold">${round(tvl, 2)}</div>
                <div className="divider divider-secondary"></div>
              </div>
              <div>
                <div className="divider divider-secondary"></div>
                <div>Net contibutions:</div>
                <div className="font-bold">${round(contributions, 2)}</div>
                <div className="divider divider-secondary"></div>
              </div>
              <div>
                <div className="divider divider-secondary"></div>
                <div>Net PNL</div>
                <div className="">${round(tvl - contributions, 2)}</div>
                <div className="divider divider-secondary"></div>
              </div>
              <div>
                <div className="divider divider-secondary"></div>
                <div>Net PNL (%)</div>
                <div className="">{round(percentGainCalc(tvl, contributions), 2)}%</div>
                <div className="divider divider-secondary"></div>
              </div>
              <div>
                <div>Num. Assets</div>
                <div className="">{data.length}</div>
                {/* <div className="divider divider-secondary"></div> */}
              </div>
            </div>
          </div>
        </>
        // <div></div>
        // <div>
        //   {/* <ToastContainer /> */}
        //   <h1>{portfolio.portfolio_data.portfolio_name}</h1>

        //   <div>Portfolio type: {portfolio.portfolio_data.account_type}</div>
        //   {/* <div>TVL: {portfolio.tvl}</div>
        //   <div>Total Contributions: {portfolio.contributions}</div> */}

        //   {/* <PieChart data={data}/> */}

        //   <div className="stats stats-vertical lg:stats-horizontal shadow text-primary bg-secondary">
        //     <div className="stat">
        //       <div className="stat-title">Total Value</div>
        //       <div className="stat-value">${round(portfolio.tvl, 2)}</div>
        //       <div className="stat-desc">Contributions: ${round(portfolio.contributions, 2)}</div>
        //     </div>

        //     <div className="stat">
        //       <div className="stat-title">Net PNL ($)</div>
        //       <div className="stat-value">${round(portfolio.tvl - portfolio.contributions, 2)}</div>
        //       <div className="stat-desc"></div>
        //     </div>

        //     <div className="stat">
        //       <div className="stat-title">Net PNL (%)</div>
        //       <div className="stat-value">
        //         {round((portfolio.tvl / portfolio.contributions - 1) * 100, 2)}%
        //       </div>
        //       <div className="stat-desc"></div>
        //     </div>
        //   </div>

        //   <h2 className="mt-4">Assets:</h2>

        //   <div className="relative">
        //     {edit && (
        //       <div className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-100">
        //         <EditAssets
        //           // data={data}
        //           // setReload={setReload}
        //           portfolio_name={params.portfolio}
        //           setEdit={setEdit}
        //         />
        //       </div>
        //     )}
        //     <div
        //       className={`transition-opacity duration-300 ease-in-out ${
        //         edit ? "opacity-0 pointer-events-none" : "opacity-100"
        //       }`}
        //     >
        //       <div className="my-8">
        //         {data.length == 0 ? (
        //           <ErrorCode error={204} text={"No assets currently, add some to get started"} />
        //         ) : (
        //           <>
        //             <AssetTable data={data} tvl={portfolio.tvl} />
        //           </>
        //         )}
        //       </div>
        //     </div>
        //   </div>
        // </div>
      )}
      <>
        <div className="flex flex-col w-full">
          <div className="divider divider-primary">Other Actions</div>
        </div>
        <div className="flex gap-4 justify-items-left py-4 bg-white justify-center rounded-3xl">
          {/* <div> */}
          <AddAssetButton toggleVisiblity={setAddAsset} visibility={addAsset} className="w-200px" />
          <EditButton setEdit={setEdit} edit={edit} className="w-200px" />
          <DeletePortfolio name={params.portfolio} className="w-200px" />
        </div>
        <AddAssets
          name={params.portfolio}
          setReload={setReload}
          visible={addAsset}
          className="w-200px"
        />
      </>
    </div>
  )
}
