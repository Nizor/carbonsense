import { useState, useEffect } from 'react';
import { HashConnect, HashConnectTypes, MessageTypes } from '@hashgraph/hashconnect';
import { Transaction, TransferTransaction, Hbar, AccountId } from '@hashgraph/sdk';

export const useHashConnect = () => {
    const [hashConnect, setHashConnect] = useState<HashConnect | null>(null);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [pairingString, setPairingString] = useState<string>('');

    useEffect(() => {
        const initHashConnect = async () => {
            const appMetadata: HashConnectTypes.AppMetadata = {
                name: 'CarbonSense AI',
                description: 'Carbon MRV Readiness Agent',
                icon: 'https://carbonsense.ai/logo.png', // optional
            };

            const hc = new HashConnect(
                'testnet',
                appMetadata,
                'carbonsense-ai' // unique identifier for your app
            );

            await hc.init();
            setHashConnect(hc);

            // Listen for connection events
            hc.foundExtensionEvent.on((wallet) => {
                console.log('Found extension:', wallet);
            });

            hc.pairingEvent.on((pairingData) => {
                console.log('Pairing event:', pairingData);
            });

            hc.connectionStatusChangeEvent.on((status) => {
                console.log('Connection status:', status);
                if (status === 'connected') {
                    // Get account info
                    hc.getAccountIds().then((ids) => {
                        if (ids.length > 0) setAccountId(ids[0]);
                    });
                } else if (status === 'disconnected') {
                    setAccountId(null);
                }
            });

            // Generate a pairing string
            const pairingString = hc.generatePairingString();
            setPairingString(pairingString);
        };

        initHashConnect();
    }, []);

    const connectWallet = async () => {
        if (!hashConnect) return;
        setIsConnecting(true);
        try {
            // Open extension with pairing string
            await hashConnect.connectToExtension();
            // Wait for connection (optional)
            return new Promise((resolve) => {
                const check = setInterval(async () => {
                    const ids = await hashConnect.getAccountIds();
                    if (ids.length > 0) {
                        clearInterval(check);
                        setAccountId(ids[0]);
                        setIsConnecting(false);
                        resolve({ accountId: ids[0] });
                    }
                }, 500);
            });
        } catch (error) {
            setIsConnecting(false);
            throw error;
        }
    };

    const disconnectWallet = async () => {
        if (hashConnect) {
            await hashConnect.disconnect();
            setAccountId(null);
        }
    };

    const sendTransaction = async (transaction: Transaction): Promise<string> => {
        if (!hashConnect || !accountId) throw new Error('Wallet not connected');
        try {
            const txBytes = transaction.toBytes();
            const result = await hashConnect.sendTransaction(accountId, txBytes);
            return result.transactionId.toString();
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    };

    return {
        accountId,
        isConnecting,
        connectWallet,
        disconnectWallet,
        sendTransaction,
        pairingString,
    };
};