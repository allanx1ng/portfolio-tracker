"use client";
import { useState, useEffect } from "react";
import PlaidConnect from "@/components/Stocks/PlaidLink";
import { getTransactionAccounts, fetchTransactions } from "@/util/transactionService";
import Spinner from "@/components/ui/Spinner";

export default function TestTransactionsPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactionsByAccount, setTransactionsByAccount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { accounts: accts } = await getTransactionAccounts();

      // Fetch first 5 transactions for each account in parallel
      const txResults = await Promise.all(
        accts.map((a) =>
          fetchTransactions({ account_id: a.account_id }, 5, 0)
            .then((r) => ({ account_id: a.account_id, transactions: r.transactions || [] }))
            .catch(() => ({ account_id: a.account_id, transactions: [] }))
        )
      );

      const txMap = {};
      txResults.forEach(({ account_id, transactions }) => {
        txMap[account_id] = transactions;
      });

      setAccounts(accts);
      setTransactionsByAccount(txMap);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl mb-6">Test Plaid Transactions</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg mb-3">Connect Transaction Account</h2>
        <p className="text-sm text-gray-500 mb-4">
          Connect a checking, savings, or credit card account to enable transaction syncing.
        </p>
        <PlaidConnect
          product="transactions"
          buttonText="Connect Transaction Account"
          onSuccess={loadData}
        />
      </div>

      {loading ? (
        <Spinner size="md" className="text-action-primary" />
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded">Error: {error}</div>
      ) : accounts.length === 0 ? (
        <p className="text-gray-500">No transaction accounts connected yet.</p>
      ) : (
        <div className="space-y-8">
          {accounts.map((account) => (
            <AccountSection
              key={account.account_id}
              account={account}
              transactions={transactionsByAccount[account.account_id] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AccountSection({ account, transactions }) {
  const currency = account.iso_currency_code || "USD";

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Account header */}
      <div className="p-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {account.institution_logo ? (
            <img
              src={`data:image/png;base64,${account.institution_logo}`}
              alt={account.institution_name}
              className="w-8 h-8 rounded"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-gray-200" />
          )}
          <div>
            <p className="font-medium">{account.name}</p>
            <p className="text-xs text-gray-500">
              {account.institution_name} · {account.subtype || account.type}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="font-medium">{formatCurrency(account.current_balance, currency)}</p>
          {account.available_balance != null && account.available_balance !== account.current_balance && (
            <p className="text-xs text-gray-400">
              Available: {formatCurrency(account.available_balance, currency)}
            </p>
          )}
        </div>
      </div>

      {/* Transactions table */}
      {transactions.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">No transactions found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 border-t">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((t) => (
              <tr key={t.transaction_id}>
                <td className="p-3 text-gray-500 whitespace-nowrap">{t.date}</td>
                <td className="p-3">
                  <p>{t.merchant_name || t.name}</p>
                  {t.merchant_name && t.merchant_name !== t.name && (
                    <p className="text-xs text-gray-400">{t.name}</p>
                  )}
                  {t.pending && (
                    <span className="text-xs text-yellow-600">Pending</span>
                  )}
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  {t.category_detailed || t.category_primary || "—"}
                </td>
                <td className={`p-3 text-right font-medium ${t.amount < 0 ? "text-green-600" : ""}`}>
                  {t.amount < 0 ? "+" : ""}
                  {formatCurrency(Math.abs(t.amount), t.iso_currency_code || "USD")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function formatCurrency(value, currency = "USD") {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}
