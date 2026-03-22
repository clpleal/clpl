import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();

const db = getFirestore();

const REQUESTS_COLLECTION = 'requests';
const USERS_COLLECTION = 'users';

type RequestStatus = 'published' | 'in_progress' | 'completed' | 'expired' | 'cancelled';

interface ServiceRequest {
  clientId: string;
  serviceType: string;
  description: string;
  urgencyLevel: number;
  suggestedPrice: number;
  status: RequestStatus;
  expiresAt?: FirebaseFirestore.Timestamp;
  acceptedProviderId?: string | null;
  finalPrice?: number | null;
}

interface Offer {
  providerId: string;
  priceOffered: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export const onRequestCreated = onDocumentCreated(`${REQUESTS_COLLECTION}/{requestId}`, async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.warn('Request creation event without snapshot');
    return;
  }

  const request = snapshot.data() as ServiceRequest;
  logger.info('New request created', {
    requestId: snapshot.id,
    clientId: request.clientId,
    serviceType: request.serviceType,
    urgencyLevel: request.urgencyLevel,
  });

  // Placeholder: consultar geohash/raio e notificar prestadores elegíveis via FCM.
});

export const onOfferCreated = onDocumentCreated(`${REQUESTS_COLLECTION}/{requestId}/offers/{offerId}`, async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.warn('Offer creation event without snapshot');
    return;
  }

  const offer = snapshot.data() as Offer;
  const requestId = event.params.requestId;
  const requestRef = db.collection(REQUESTS_COLLECTION).doc(requestId);
  const requestSnapshot = await requestRef.get();

  if (!requestSnapshot.exists) {
    logger.error('Parent request not found for new offer', { requestId, offerId: snapshot.id });
    return;
  }

  const request = requestSnapshot.data() as ServiceRequest;
  logger.info('New offer created', {
    requestId,
    offerId: snapshot.id,
    providerId: offer.providerId,
    clientId: request.clientId,
    priceOffered: offer.priceOffered,
  });

  // Placeholder: enviar push para o cliente informando nova contra-oferta/aceite.
});

export const onRequestUpdated = onDocumentUpdated(`${REQUESTS_COLLECTION}/{requestId}`, async (event) => {
  const before = event.data?.before.data() as ServiceRequest | undefined;
  const after = event.data?.after.data() as ServiceRequest | undefined;

  if (!before || !after || before.status === after.status) {
    return;
  }

  logger.info('Request status changed', {
    requestId: event.params.requestId,
    previousStatus: before.status,
    nextStatus: after.status,
    acceptedProviderId: after.acceptedProviderId ?? null,
  });

  if (after.status === 'in_progress') {
    // Placeholder: iniciar lógica financeira, ETA ou notificações de contato mínimo.
    return;
  }

  if (after.status === 'completed') {
    // Placeholder: liberar avaliação bilateral e concluir fluxo financeiro.
    return;
  }
});

export const expireRequests = onSchedule('every 30 minutes', async () => {
  const now = Timestamp.now();
  const snapshot = await db
    .collection(REQUESTS_COLLECTION)
    .where('status', '==', 'published')
    .where('expiresAt', '<=', now)
    .get();

  if (snapshot.empty) {
    logger.info('No requests to expire');
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      status: 'expired',
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();

  logger.info('Expired published requests', {
    count: snapshot.size,
    executedAt: now.toDate().toISOString(),
  });
});

export const backfillUserMetrics = onSchedule('every day 02:00', async () => {
  const ratingsSnapshot = await db.collection('ratings').get();
  const aggregates = new Map<string, { total: number; count: number }>();

  ratingsSnapshot.docs.forEach((doc) => {
    const data = doc.data() as { rateeId?: string; score?: number };
    if (!data.rateeId || typeof data.score !== 'number') {
      return;
    }

    const current = aggregates.get(data.rateeId) ?? { total: 0, count: 0 };
    current.total += data.score;
    current.count += 1;
    aggregates.set(data.rateeId, current);
  });

  const batch = db.batch();

  aggregates.forEach((aggregate, userId) => {
    const ref = db.collection(USERS_COLLECTION).doc(userId);
    batch.set(
      ref,
      {
        ratingAverage: Number((aggregate.total / aggregate.count).toFixed(2)),
        ratingCount: aggregate.count,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();

  logger.info('User rating metrics backfilled', {
    updatedUsers: aggregates.size,
  });
});
