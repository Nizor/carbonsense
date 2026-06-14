import { useState, useEffect } from 'react';
import { HederaWalletConnect, WalletConnectSession } from '@hashgraph/hedera-wallet-connect';
import { Transaction } from '@hashgraph/sdk';

export const useHederaWallet = () => {
    const [walletConnect, setWalletConnect] = useState<HederaWalletConnect | null>(null);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        const initWallet = async () => {
            const config = {
                projectId: "b98ff7dbf3200f774d2827412dd1cafa",
                metadata: {
                    name: "CarbonSense AI",
                    description: "Carbon MRV Readiness Agent",
                    url: window.location.origin,
                    icons: []
                },
                network: "testnet"
            };
            const wc = new HederaWalletConnect(config);
            setWalletConnect(wc);

            // Check if already connected
            if (wc.session) {
                setAccountId(wc.session.accountId);
            }
        };
        initWallet();
    }, []);

    const connectWallet = async () => {
        if (!walletConnect) return;
        setIsConnecting(true);
        try {
            const session: WalletConnectSession = await walletConnect.connect();
            setAccountId(session.accountId);
            return { accountId: session.accountId };
        } catch (error) {
            console.error("Connection failed:", error);
            throw error;
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = async () => {
        if (walletConnect) {
            await walletConnect.disconnect();
            setAccountId(null);
        }
    };

    const sendTransaction = async (transactionBytes: string): Promise<string> => {
        if (!walletConnect || !accountId) throw new Error("Wallet not connected");
        const transaction = Transaction.fromBytes(Buffer.from(transactionBytes, 'hex'));
        const result = await walletConnect.executeTransaction(accountId, transaction);
        // result is typically the transaction receipt; extract transaction ID
        return result.transactionId.toString();
    };

    return { accountId, isConnecting, connectWallet, disconnectWallet, sendTransaction };
};