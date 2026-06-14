// frontend/hooks/useHashPack.ts
import { useState, useEffect, useRef } from 'react';
import { TransferTransaction, Hbar, AccountId, Transaction } from '@hashgraph/sdk';

declare global {
    interface Window {
        hashpack?: {
            connect: (params: any) => Promise<any>;
            disconnect: () => Promise<void>;
            sendTransaction: (tx: Transaction) => Promise<any>;
            getAvailableAccounts: () => Promise<string[]>;
            isConnected: () => Promise<boolean>;
        };
    }
}

export const useHashPack = () => {
    const [accountId, setAccountId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [checking, setChecking] = useState(true);
    const checkInterval = useRef<NodeJS.Timeout>();

    useEffect(() => {
        // Poll for window.hashpack (extension may load late)
        const pollHashPack = () => {
            if (typeof window !== 'undefined' && window.hashpack) {
                setIsAvailable(true);
                setChecking(false);
                if (checkInterval.current) clearInterval(checkInterval.current);
                // Check existing connection
                window.hashpack.getAvailableAccounts()
                    .then((accounts: string[]) => {
                        if (accounts && accounts.length > 0) setAccountId(accounts[0]);
                    })
                    .catch(console.error);
                return true;
            }
            return false;
        };

        // Try immediately
        if (!pollHashPack()) {
            checkInterval.current = setInterval(() => {
                if (pollHashPack()) clearInterval(checkInterval.current);
            }, 500);
        }

        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
            if (checkInterval.current) clearInterval(checkInterval.current);
            setChecking(false);
            if (!window.hashpack) setIsAvailable(false);
        }, 10000);

        return () => {
            if (checkInterval.current) clearInterval(checkInterval.current);
            clearTimeout(timeout);
        };
    }, []);

    const connectWallet = async () => {
        if (!isAvailable) {
            const msg = "HashPack extension not detected. Please ensure it's installed and enabled for this site.";
            alert(msg);
            throw new Error(msg);
        }
        setIsConnecting(true);
        try {
            const response = await window.hashpack!.connect({
                network: "testnet",
                metadata: {
                    name: "CarbonSense AI",
                    description: "Carbon MRV Readiness Agent"
                }
            });
            if (response && response.accountIds && response.accountIds.length) {
                setAccountId(response.accountIds[0]);
                return { accountId: response.accountIds[0] };
            } else {
                throw new Error("No accounts found");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            throw error;
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = async () => {
        if (window.hashpack?.disconnect) {
            await window.hashpack.disconnect();
        }
        setAccountId(null);
    };

    const sendTransaction = async (transaction: Transaction): Promise<string> => {
        if (!isAvailable || !accountId) throw new Error("Wallet not connected or HashPack missing");
        try {
            const result = await window.hashpack!.sendTransaction(transaction);
            // Handle different result shapes
            const txId = result.transactionId || result.receipt?.transactionId || result;
            return txId.toString();
        } catch (error) {
            console.error("Transaction failed:", error);
            throw error;
        }
    };

    return { accountId, isConnecting, connectWallet, disconnectWallet, sendTransaction, isAvailable, checking };
};