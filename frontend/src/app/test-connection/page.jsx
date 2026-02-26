"use client";
import { useState, useEffect, useCallback } from "react";
import PlaidConnect from "@/components/Stocks/PlaidLink";
import { getConnectedAccounts, disconnectAccount } from "@/util/transactionService";
import Link from "next/link";

export default function TestConnectionPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(null);

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConnectedAccounts();
      setConnections(data.connections || []);
    } catch (err) {
      console.error("Failed to fetch connections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleDisconnect = async (itemId, name) => {
    if (!confirm(`Disconnect ${name}? This will remove all cached data for this connection.`)) return;

    try {
      setDisconnecting(itemId);
      await disconnectAccount(itemId);
      await fetchConnections();
    } catch (err) {
      console.error("Failed to disconnect:", err);
      alert("Failed to disconnect account: " + (err.response?.data?.message || err.message));
    } finally {
      setDisconnecting(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl mb-6">Test Plaid Connection</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg mb-3">Connect New Account</h2>
        <PlaidConnect
          product="investments"
          buttonText="Connect Investment Account"
          onSuccess={fetchConnections}
        />
      </div>

      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Connected Accounts</h2>
          {connections.length > 0 && (
            <Link
              href="/test-connection/portfolio"
              className="text-sm text-blue-500 hover:underline"
            >
              View Portfolio →
            </Link>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : connections.length === 0 ? (
          <p className="text-gray-500">No accounts connected yet.</p>
        ) : (
          <ul className="space-y-3">
            {connections.map((conn) => (
              <li
                key={conn.item_id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex items-center gap-3">
                  {conn.institution_logo ? (
                    <img
                      src={`data:image/png;base64,${conn.institution_logo}`}
                      alt={conn.institution_name}
                      className="w-10 h-10 rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      N/A
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{conn.institution_name}</p>
                    <p className="text-sm text-gray-500">
                      {conn.product} · {new Date(conn.last_updated).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnect(conn.item_id, conn.institution_name)}
                  disabled={disconnecting === conn.item_id}
                  className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  {disconnecting === conn.item_id ? "Removing..." : "Disconnect"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
