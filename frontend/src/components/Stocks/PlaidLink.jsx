"use client";
import { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { createLinkToken, exchangePublicToken } from "@/util/transactionService";
import { successMsg, errorMsg, warnMsg } from "@/util/toastNotifications";

/**
 * PlaidConnect component for connecting to financial institutions via Plaid
 * 
 * @param {Object} props
 * @param {string} [props.institutionId] - Optional institution ID to pre-select
 * @param {string} [props.institutionName] - Optional institution name to display
 * @param {Function} [props.onSuccess] - Optional callback for successful connection
 * @param {string} [props.buttonText] - Optional custom button text
 * @param {string} [props.buttonClassName] - Optional custom button class
 * @returns {JSX.Element}
 */
const PlaidConnect = ({
  institutionId = null,
  institutionName = null,
  onSuccess = null,
  buttonText = 'Connect Account',
  buttonClassName = "p-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [linkToken, setLinkToken] = useState(null);
    const [error, setError] = useState(null);

    // Function to create link token
    const getLinkToken = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const data = await createLinkToken(institutionId, institutionName);
            setLinkToken(data.link_token);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to initialize Plaid connection';
            setError(errorMessage);
            errorMsg(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [institutionId, institutionName]);

    useEffect(() => {
        getLinkToken();
    }, [getLinkToken]);

    // Handle successful Plaid link
    const handleSuccess = useCallback(async (public_token, metadata) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await exchangePublicToken(
                public_token, 
                institutionId,
                institutionName
            );

            successMsg('Account connected successfully!');
            
            // Call the onSuccess callback if provided
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(response);
            }
        } catch (err) {
            // Check for specific error types
            if (err.response?.status === 409) {
                // Account already connected
                const message = err.response.data.message || 'This account is already connected';
                setError(message);
                warnMsg(message);
            } else {
                // General error
                const errorMessage = err.response?.data?.message || 'Failed to connect account';
                setError(errorMessage);
                errorMsg(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [institutionId, institutionName, onSuccess]);

    // Handle Plaid exit
    const handleExit = useCallback((err, metadata) => {
        if (err != null) {
            // The user encountered an error while linking
            const errorMessage = 'Error connecting to your financial institution. Please try again.';
            setError(errorMessage);
            errorMsg(errorMessage);
        }
    }, []);

    const config = {
        token: linkToken,
        onSuccess: handleSuccess,
        onExit: handleExit,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <div>
            <button
                onClick={() => open()}
                disabled={!ready || isLoading}
                className={buttonClassName}
            >
                {isLoading ? 'Connecting...' : buttonText}
            </button>
            
            {error && (
                <div className="mt-2 text-red-500 text-sm">
                    {error}
                </div>
            )}
            
            {!ready && !error && !isLoading && (
                <div className="mt-2 text-gray-500 text-sm">
                    Initializing connection...
                </div>
            )}
        </div>
    );
};

export default PlaidConnect;
