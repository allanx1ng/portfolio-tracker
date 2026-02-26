"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getInvestments } from "@/util/getInvestments";
import apiClient from "@/util/apiClient";
import Link from "next/link";

export default function TestPortfolioPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getInvestments();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch investments:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleRefresh = async () => {
    await fetchData();
  };

  if (!user) {
    return <div className="text-center py-12">Please log in to view portfolio.</div>;
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading investments...</div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-red-500 p-4 border border-red-300 rounded">Error: {error}</div>
      </div>
    );
  }

  const institutions = data?.institutions || [];
  const overview = data?.overallPortfolioOverview;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Investment Portfolio</h1>
        <Link href="/test-connection" className="text-sm text-blue-500 hover:underline">
          ← Connections
        </Link>
      </div>

      {overview && overview.totalAccountValue > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 border rounded">
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-lg">{formatCurrency(overview.totalAccountValue)}</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-xs text-gray-500">Investments</p>
            <p className="text-lg">{formatCurrency(overview.totalInvestmentValue)}</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-xs text-gray-500">Cash</p>
            <p className="text-lg">{formatCurrency(overview.totalCashEquiv)}</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-xs text-gray-500">Gain/Loss</p>
            <p className={`text-lg ${overview.totalPortfolioGain >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(overview.totalPortfolioGain)}
            </p>
          </div>
        </div>
      )}

      {institutions.length === 0 ? (
        <p className="text-gray-500">
          No investment data yet.{" "}
          <Link href="/test-connection" className="text-blue-500 hover:underline">
            Connect an account
          </Link>{" "}
          first.
        </p>
      ) : (
        <div className="space-y-6">
          {institutions.map((inst) => (
            <InstitutionCard
              key={inst.institution_id}
              institution={inst}
              refreshing={loading}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InstitutionCard({ institution, refreshing, onRefresh }) {
  const { institution_name, institution_logo, last_synced, data } = institution;
  const accounts = data?.processed || [];
  const overview = data?.portfolioOverview?.overall;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          {institution_logo ? (
            <img
              src={`data:image/png;base64,${institution_logo}`}
              alt={institution_name}
              className="w-8 h-8 rounded"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-gray-200" />
          )}
          <div>
            <p className="font-medium">{institution_name}</p>
            {overview && (
              <p className="text-sm text-gray-500">
                {formatCurrency(overview.totalAccountValue)} total
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400">Synced: {formatDate(last_synced)}</span>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="divide-y">
        {accounts.map((account) => (
          <Link
            key={account.account_id}
            href={`/test-connection/portfolio/${account.account_id}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-sm">
                {account.name}
                {account.official_name && account.official_name !== account.name && (
                  <span className="text-gray-400 font-normal"> — {account.official_name}</span>
                )}
              </p>
              <p className="font-medium">{formatCurrency(account.total_value, account.iso_currency_code || "USD")}</p>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>{account.holdings_count} holdings</span>
              <span>Type: {account.subtype || account.type}</span>
              <span>Balance: {formatCurrency(account.current_balance, account.iso_currency_code || "USD")}</span>
            </div>
          </Link>
        ))}
      </div>
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

function formatDate(dateStr) {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleString();
}
