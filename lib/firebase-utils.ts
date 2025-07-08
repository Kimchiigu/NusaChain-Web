import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { AuditReport, TrustScore, SuspiciousTransaction } from '@/types/security';

// Collection names
const COLLECTIONS = {
  AUDIT_REPORTS: 'auditReports',
  TRUST_SCORES: 'trustScores',
  SUSPICIOUS_TRANSACTIONS: 'suspiciousTransactions',
  USER_AUDITS: 'userAudits'
};

// Audit Reports
export async function saveAuditReport(report: Omit<AuditReport, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.AUDIT_REPORTS), {
      ...report,
      createdAt: serverTimestamp(),
    });
    
    // Update trust score if malicious behavior detected
    if (report.isMalicious) {
      await updateTrustScore(report.url, -10);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving audit report:', error);
    throw error;
  }
}

export async function getAuditReports(userId?: string) {
  try {
    let q = query(
      collection(db, COLLECTIONS.AUDIT_REPORTS),
      orderBy('createdAt', 'desc')
    );
    
    if (userId) {
      q = query(
        collection(db, COLLECTIONS.AUDIT_REPORTS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AuditReport[];
  } catch (error) {
    console.error('Error getting audit reports:', error);
    throw error;
  }
}

// Trust Scores
export async function getTrustScore(url: string): Promise<TrustScore | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.TRUST_SCORES),
      where('url', '==', url)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as TrustScore;
  } catch (error) {
    console.error('Error getting trust score:', error);
    throw error;
  }
}

export async function updateTrustScore(url: string, scoreChange: number) {
  try {
    const existingScore = await getTrustScore(url);
    
    if (existingScore) {
      const docRef = doc(db, COLLECTIONS.TRUST_SCORES, existingScore.id);
      await updateDoc(docRef, {
        score: increment(scoreChange),
        lastUpdated: serverTimestamp(),
        reportCount: increment(1)
      });
    } else {
      // Create new trust score entry
      await addDoc(collection(db, COLLECTIONS.TRUST_SCORES), {
        url,
        score: Math.max(0, 50 + scoreChange), // Start at 50, minimum 0
        reportCount: 1,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating trust score:', error);
    throw error;
  }
}

// Suspicious Transactions
export async function saveSuspiciousTransaction(transaction: Omit<SuspiciousTransaction, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SUSPICIOUS_TRANSACTIONS), {
      ...transaction,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving suspicious transaction:', error);
    throw error;
  }
}

export async function getSuspiciousTransactions(contractAddress: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.SUSPICIOUS_TRANSACTIONS),
      where('contractAddress', '==', contractAddress),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SuspiciousTransaction[];
  } catch (error) {
    console.error('Error getting suspicious transactions:', error);
    throw error;
  }
}