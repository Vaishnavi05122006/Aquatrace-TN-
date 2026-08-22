import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export function subscribeToReports(onChange, onError) {
  const q = query(collection(db, 'reports'), orderBy('syncedAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const reports = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(reports);
    },
    onError,
  );
}

export function acknowledgeReport(reportId, diverUid) {
  return updateDoc(doc(db, 'reports', reportId), {
    status: 'acknowledged',
    resolvedBy: diverUid,
  });
}

export function resolveReport(reportId, diverUid, notes = '') {
  return updateDoc(doc(db, 'reports', reportId), {
    status: 'resolved',
    resolvedBy: diverUid,
    resolvedAt: serverTimestamp(),
    notes,
  });
}

export function reopenReport(reportId) {
  return updateDoc(doc(db, 'reports', reportId), {
    status: 'reported',
    resolvedBy: null,
    resolvedAt: null,
  });
}

export function deleteReport(reportId) {
  return deleteDoc(doc(db, 'reports', reportId));
}
