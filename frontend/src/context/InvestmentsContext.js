"use client"

import React, { createContext, useState, useEffect } from "react"
// import { getPortfolios } from "@/util/getUserPortfolios"
import { getInvestments } from "@/util/getInvestments"

const InvestmentsContext = createContext()

export const InvestmentsProvider = ({ children }) => {
    const [data, setData] = useState([])
    const [loadingPortfolios, setLoading] = useState(true)
    const [errorPortfolios, setError] = useState(false)
    const [reload, setReload] = useState(false)
    useEffect(() => {
        fetchInvestments()
    }, [])
    useEffect(() => {
        if (reload) {
            fetchInvestments()
        }
    }, [reload])

    const fetchInvestments = async () => {
        try {
            setError(false)
            const data = await getInvestments()
            if (data) {
                // console.log(data.data)
                setData(data.data)
                // setTvl(data.tvl)
                // setLoading(false)
            }
            // successMsg("success")
        } catch (err) {
            // errorMsg(err)
            // setLoading(false)
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <InvestmentsContext.Provider
            value={{ data, errorPortfolios, setReload }}
        >
            {children}
        </InvestmentsContext.Provider>
    )
}


export const useInvestments = () => React.useContext(InvestmentsContext)