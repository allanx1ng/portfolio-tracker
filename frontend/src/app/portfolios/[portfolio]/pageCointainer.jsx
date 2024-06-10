"use client"
import { useState, useEffect } from "react"
import GetPortfolio from "./getPortfolio"
import AddAssets from "./addAssets"
import Error from "./error"
import EditAsset from "./EditAsset"
import DeletePortfolio from "./DeletePortfolio"

export default function ({ params }) {
  const [reload, setReload] = useState(false)
  const [error, setError] = useState(false)
  const [portfolio, setPortfolio] = useState([])
  const [edit, setEdit] = useState(false)

  return error ? (
    <Error error={error} />
  ) : (
    <div>
      {/* <ToastContainer/> */}
      <GetPortfolio
        name={params.portfolio}
        reload={reload}
        error={error}
        setError={setError}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
      />

      {portfolio.length == 0 ? (
        <Error error={204} />
      ) : (
        // <div></div>
        <div>
          {/* <ToastContainer /> */}
          <h1>{portfolio.portfolio_data.portfolio_name}</h1>
          <div>assets:</div>
          <div>{portfolio.portfolio_data.account_type}</div>
          <div>TVL: {portfolio.tvl}</div>
          <div>Total Contributions: {portfolio.contributions}</div>

          {edit
            ? "edit mode"
            : portfolio.assets.map((asset) => (
                <div key={asset.asset_ticker}>
                  {asset.asset_name} {parseFloat(asset.amount).toFixed(2)}{" "}
                  {parseFloat(asset.avg_price).toFixed(2)}
                </div>
              ))}

          <EditAsset setEdit={setEdit} edit={edit}/>
        </div>
      )}

      <AddAssets name={params.portfolio} setReload={setReload} />
      <DeletePortfolio name={params.portfolio}/>
    </div>
  )
}
