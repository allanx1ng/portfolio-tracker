"use client";
import { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { createLinkToken, exchangePublicToken } from "@/util/transactionService";
import { successMsg, errorMsg, warnMsg } from "@/util/toastNotifications";
import { Button } from '@/components/ui/buttons';

/**
 * PlaidConnect component for connecting to financial institutions via Plaid
 * 
 * @param {Object} props
 * @param {string} [props.institutionId] - Optional institution ID to pre-select
 * @param {string} [props.institutionName] - Optional institution name to display
 * @param {Function} [props.onSuccess] - Optional callback for successful connection
 * @param {string} [props.buttonText] - Optional custom button text (default: 'Connect Account')
 * @param {string} [props.variant] - Button variant: 'primary', 'secondary', 'outline', 'ghost', or 'danger' (default: 'primary')
 * @param {string} [props.size] - Button size: 'sm', 'md', or 'lg' (default: 'md')
 * @returns {JSX.Element}
 */
const PlaidConnect = ({
  product = 'investments',
  onSuccess = null,
  buttonText = 'Connect Account',
  variant = 'primary',
  size = 'md'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [linkToken, setLinkToken] = useState(null);
    const [error, setError] = useState(null);

    // Function to create link token
    const getLinkToken = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const data = await createLinkToken(product);
            setLinkToken(data.link_token);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to initialize Plaid connection';
            setError(errorMessage);
            errorMsg(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [product]);

    useEffect(() => {
        getLinkToken();
    }, [getLinkToken]);

    // Handle successful Plaid link
    const handleSuccess = useCallback(async (public_token, metadata) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await exchangePublicToken(public_token);

            successMsg('Account connected successfully!');

            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(response);
            }
        } catch (err) {
            if (err.response?.status === 409) {
                const message = err.response.data.message || 'This account is already connected';
                setError(message);
                warnMsg(message);
            } else {
                const errorMessage = err.response?.data?.message || 'Failed to connect account';
                setError(errorMessage);
                errorMsg(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [onSuccess]);

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
            <Button
                onClick={() => open()}
                disabled={!ready}
                isLoading={isLoading}
                loadingText="Connecting..."
                variant={variant}
                size={size}
            >
                {buttonText}
            </Button>
            
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
