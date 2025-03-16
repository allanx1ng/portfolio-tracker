"use client";
import { useState, useEffect } from "react";
import {
    usePlaidLink,
    PlaidLinkOptions,
    PlaidLinkOnSuccess,
} from "react-plaid-link";
import apiClient from "@/util/apiClient";

const PlaidConnect = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [linkToken, setLinkToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLinkToken = async () => {
            try {
                const { data } = await apiClient.post('/connect/plaid/create-link', {
                    institution_id: 'ins_118273',
                    institution_name: 'Wealthsimple (Canada)'
                });
                setLinkToken(data.link_token);
            } catch (err) {
                setError('Failed to initialize');
            }
        };
        getLinkToken();
    }, []);



    const config = {
        token: linkToken,
        // institution_id: 'ins_118273',
        onSuccess: async (public_token, metadata) => {
            try {
                setIsLoading(true);
                const response = await apiClient.post('/connect/plaid/exchange-token', {
                    public_token,
                    institution_id: 'ins_118273',
                    institution_name: 'Wealthsimple (Canada)'
                });

                if (response.data.success) {
                    console.log('Account connected successfully');
                }
            } catch (err) {
                setError('Failed to connect account');
            } finally {
                setIsLoading(false);
            }
        },
        onExit: (err) => {
            if (err) setError('Connection interrupted');
        }
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <button
            onClick={() => open()}
            // disabled={!ready || isLoading}
            className="p-4 bg-blue-500 text-white rounded"
        >
            {isLoading ? 'Connecting...' : 'Connect Account'}
        </button>
    );
};

export default PlaidConnect;
