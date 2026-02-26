"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getInvestments } from "@/util/getInvestments";
import Link from "next/link";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [institutionName, setInstitutionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInvestments();

      // Find the account across all institutions
      for (const inst of data.institutions || []) {
        const found = (inst.data?.processed || []).find(
          (a) => a.account_id === accountId
        );
        if (found) {
          setAccount(found);
          setInstitutionName(inst.institution_name);
          break;
        }
      }
    } catch (err) {
      console.error("Failed to fetch account:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  if (!user) {
    return <div className="text-center py-12">Please log in to view account.</div>;
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading account...</div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-red-500 p-4 border border-red-300 rounded">Error: {error}</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-500">Account not found.</p>
        <Link href="/test-connection/portfolio" className="text-blue-500 hover:underline text-sm">
          ← Back to portfolio
        </Link>
      </div>
    );
  }

  const currency = account.iso_currency_code || "USD";
  const holdings = account.holdings || [];
  const investmentHoldings = holdings.filter((h) => !h.is_cash_equivalent);
  const cashHoldings = holdings.filter((h) => h.is_cash_equivalent);

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/test-connection/portfolio" className="text-sm text-blue-500 hover:underline">
        ← Back to portfolio
      </Link>

      <div className="mt-4 mb-6">
        <p className="text-sm text-gray-500">{institutionName}</p>
        <h1 className="text-2xl">
          {account.name}
          {account.official_name && account.official_name !== account.name && (
            <span className="text-gray-400 text-lg font-normal"> — {account.official_name}</span>
          )}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 border rounded">
          <p className="text-xs text-gray-500">Total Value</p>
          <p className="text-lg">{formatCurrency(account.total_value, currency)}</p>
        </div>
        <div className="p-3 border rounded">
          <p className="text-xs text-gray-500">Balance</p>
          <p className="text-lg">{formatCurrency(account.current_balance, currency)}</p>
        </div>
        <div className="p-3 border rounded">
          <p className="text-xs text-gray-500">Holdings</p>
          <p className="text-lg">{account.holdings_count}</p>
        </div>
        <div className="p-3 border rounded">
          <p className="text-xs text-gray-500">Type</p>
          <p className="text-lg capitalize">{account.subtype || account.type}</p>
        </div>
      </div>

      {investmentHoldings.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg mb-3">Securities</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Value</th>
                  <th className="p-3 text-right">Cost Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {investmentHoldings.map((h) => (
                  <tr key={h.security_id}>
                    <td className="p-3">
                      <p className="font-medium">{h.ticker !== "N/A" ? h.ticker : h.name}</p>
                      {h.ticker !== "N/A" && (
                        <p className="text-xs text-gray-400">{h.name}</p>
                      )}
                      <p className="text-xs text-gray-400">{h.type}</p>
                    </td>
                    <td className="p-3 text-right">{formatCurrency(h.current_price, currency)}</td>
                    <td className="p-3 text-right">{formatQuantity(h.quantity)}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(h.current_value, currency)}</td>
                    <td className="p-3 text-right text-gray-500">{formatCurrency(h.buy_price, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {cashHoldings.length > 0 && (
        <div>
          <h2 className="text-lg mb-3">Cash</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cashHoldings.map((h) => (
                  <tr key={h.security_id}>
                    <td className="p-3">{h.name}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(h.current_value, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {holdings.length === 0 && (
        <p className="text-gray-500">No holdings in this account.</p>
      )}
    </div>
  );
}

function formatCurrency(value, currency = "USD") {
  if (value == null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function formatQuantity(value) {
  if (value == null) return "0";
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(4);
}
