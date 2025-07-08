import { EtherscanTransaction } from '@/types/security';

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';

export async function getContractTransactions(
  contractAddress: string,
  page: number = 1,
  offset: number = 100
): Promise<EtherscanTransaction[]> {
  try {
    const response = await fetch(
      `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    );

    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      throw new Error(data.message || 'Failed to fetch transactions');
    }
  } catch (error) {
    console.error('Error fetching contract transactions:', error);
    throw error;
  }
}

export async function analyzeContractSuspiciousPatterns(contractAddress: string) {
  try {
    const transactions = await getContractTransactions(contractAddress, 1, 1000);
    
    // Analysis patterns
    const newWalletThreshold = 30 * 24 * 60 * 60; // 30 days in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    let suspiciousCount = 0;
    let newWalletInteractions = 0;
    let failedTransactions = 0;
    const uniqueAddresses = new Set<string>();
    
    for (const tx of transactions) {
      uniqueAddresses.add(tx.from);
      uniqueAddresses.add(tx.to);
      
      // Check for failed transactions
      if (tx.isError === '1') {
        failedTransactions++;
        suspiciousCount++;
      }
      
      // Check for interactions with new wallets (simplified - would need more data)
      const txTime = parseInt(tx.timeStamp);
      if (currentTime - txTime < newWalletThreshold) {
        newWalletInteractions++;
      }
      
      // Check for suspicious patterns in transaction data
      if (tx.methodId && tx.methodId.startsWith('0xa9059cbb')) { // Transfer method
        const value = parseInt(tx.value);
        if (value > 0) {
          // Large value transfers could be suspicious
          suspiciousCount++;
        }
      }
    }
    
    // Calculate risk score (0-100)
    const failureRate = failedTransactions / transactions.length;
    const newWalletRate = newWalletInteractions / transactions.length;
    
    let riskScore = 0;
    riskScore += failureRate * 40; // Failed transactions contribute up to 40 points
    riskScore += newWalletRate * 30; // New wallet interactions contribute up to 30 points
    riskScore += Math.min(suspiciousCount / transactions.length * 30, 30); // Other suspicious patterns
    
    return {
      contractAddress,
      totalTransactions: transactions.length,
      suspiciousTransactions: suspiciousCount,
      newWalletInteractions,
      failedTransactions,
      flaggedInteractions: 0, // Would be populated from Firebase flagged addresses
      riskScore: Math.min(Math.round(riskScore), 100),
      analysisDate: new Date(),
      uniqueAddresses: uniqueAddresses.size
    };
  } catch (error) {
    console.error('Error analyzing contract patterns:', error);
    throw error;
  }
}