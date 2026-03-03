import 'dotenv/config';

import { db, firebaseAdmin } from '../firebase/admin.js';
import { normalizePublicSlug } from '../utils/publicSlug.js';

const RUNS_COLLECTION = 'runs';
const LEGACY_EDITOR_RUNS_COLLECTION = 'editor-runs';
const LEGACY_PUBLIC_RUNS_COLLECTION = 'public-runs';
const BATCH_WRITE_LIMIT = 400;

type RunRecord = Record<string, unknown>;

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const normalizeRunRecord = (
  rawData: FirebaseFirestore.DocumentData,
  options: { forcePublic?: boolean } = {},
): RunRecord => {
  const normalizedRecord: RunRecord = { ...rawData };
  const slugCandidate =
    isString(rawData.publicSlug) && rawData.publicSlug.trim()
      ? rawData.publicSlug
      : isString(rawData.slug) && rawData.slug.trim()
        ? rawData.slug
        : undefined;

  delete normalizedRecord.slug;

  if (slugCandidate) {
    normalizedRecord.publicSlug = normalizePublicSlug(slugCandidate);
    normalizedRecord.isPublic = true;
  }

  if (options.forcePublic) {
    normalizedRecord.isPublic = true;
  }

  return normalizedRecord;
};

const buildMergePatch = (target: RunRecord, source: RunRecord): RunRecord => {
  const patch: RunRecord = {};

  for (const [key, value] of Object.entries(source)) {
    const existingValue = target[key];
    if (value === undefined) {
      continue;
    }

    if (existingValue === undefined || existingValue === null) {
      patch[key] = value;
      continue;
    }

    if (key === 'isPublic' && value === true && existingValue !== true) {
      patch[key] = true;
      continue;
    }

    if (
      key === 'publicSlug' &&
      isString(value) &&
      (!isString(existingValue) || !existingValue.trim())
    ) {
      patch[key] = value;
    }
  }

  return patch;
};

const main = async () => {
  const runsRef = db.collection(RUNS_COLLECTION);
  const fieldDelete = firebaseAdmin.firestore.FieldValue.delete();

  let batch = db.batch();
  let pendingWrites = 0;
  let committedWrites = 0;

  const flushBatch = async () => {
    if (pendingWrites === 0) {
      return;
    }

    await batch.commit();
    committedWrites += pendingWrites;
    batch = db.batch();
    pendingWrites = 0;
  };

  const queueUpdate = async (
    ref: FirebaseFirestore.DocumentReference,
    patch: RunRecord,
  ) => {
    if (Object.keys(patch).length === 0) {
      return;
    }

    batch.update(ref, patch);
    pendingWrites += 1;
    if (pendingWrites >= BATCH_WRITE_LIMIT) {
      await flushBatch();
    }
  };

  const queueSet = async (
    ref: FirebaseFirestore.DocumentReference,
    data: RunRecord,
  ) => {
    batch.set(ref, data);
    pendingWrites += 1;
    if (pendingWrites >= BATCH_WRITE_LIMIT) {
      await flushBatch();
    }
  };

  const runsById = new Map<string, RunRecord>();
  const runIdBySlug = new Map<string, string>();

  let normalizedRuns = 0;
  let createdFromEditorRuns = 0;
  let mergedFromEditorRuns = 0;
  let createdFromPublicRuns = 0;
  let mergedFromPublicRuns = 0;
  let skippedPublicRuns = 0;
  let publicRunIdConflicts = 0;

  const runsSnapshot = await runsRef.get();
  for (const runDoc of runsSnapshot.docs) {
    const existingRecord = runDoc.data() as RunRecord;
    const normalizedRecord = normalizeRunRecord(existingRecord);
    const patch: RunRecord = {};

    if ('slug' in existingRecord) {
      patch.slug = fieldDelete;
    }

    if (
      isString(normalizedRecord.publicSlug) &&
      normalizedRecord.publicSlug !== existingRecord.publicSlug
    ) {
      patch.publicSlug = normalizedRecord.publicSlug;
    }

    if (normalizedRecord.isPublic === true && existingRecord.isPublic !== true) {
      patch.isPublic = true;
    }

    if (Object.keys(patch).length > 0) {
      await queueUpdate(runDoc.ref, patch);
      normalizedRuns += 1;
    }

    const mergedRecord = { ...existingRecord, ...patch };
    if ('slug' in mergedRecord) {
      delete mergedRecord.slug;
    }

    runsById.set(runDoc.id, mergedRecord);

    const currentSlug = mergedRecord.publicSlug;
    if (isString(currentSlug) && currentSlug.trim()) {
      runIdBySlug.set(normalizePublicSlug(currentSlug), runDoc.id);
    }
  }

  const editorRunsSnapshot = await db.collection(LEGACY_EDITOR_RUNS_COLLECTION).get();
  for (const editorRunDoc of editorRunsSnapshot.docs) {
    const sourceRecord = normalizeRunRecord(editorRunDoc.data() as RunRecord);
    const existingRunRecord = runsById.get(editorRunDoc.id);

    if (!existingRunRecord) {
      await queueSet(runsRef.doc(editorRunDoc.id), sourceRecord);
      runsById.set(editorRunDoc.id, sourceRecord);

      const newSlug = sourceRecord.publicSlug;
      if (isString(newSlug) && newSlug.trim()) {
        runIdBySlug.set(newSlug, editorRunDoc.id);
      }

      createdFromEditorRuns += 1;
      continue;
    }

    const patch = buildMergePatch(existingRunRecord, sourceRecord);
    if (Object.keys(patch).length === 0) {
      continue;
    }

    await queueUpdate(runsRef.doc(editorRunDoc.id), patch);
    runsById.set(editorRunDoc.id, { ...existingRunRecord, ...patch });

    const patchedSlug = patch.publicSlug;
    if (isString(patchedSlug) && patchedSlug.trim()) {
      runIdBySlug.set(patchedSlug, editorRunDoc.id);
    }

    mergedFromEditorRuns += 1;
  }

  const publicRunsSnapshot = await db.collection(LEGACY_PUBLIC_RUNS_COLLECTION).get();
  for (const publicRunDoc of publicRunsSnapshot.docs) {
    const sourceRecord = normalizeRunRecord(publicRunDoc.data() as RunRecord, {
      forcePublic: true,
    });
    const normalizedSlug = sourceRecord.publicSlug;

    if (!isString(normalizedSlug) || !normalizedSlug.trim()) {
      skippedPublicRuns += 1;
      continue;
    }

    const existingRunIdBySlug = runIdBySlug.get(normalizedSlug);
    if (existingRunIdBySlug) {
      const existingRunRecord = runsById.get(existingRunIdBySlug);
      if (!existingRunRecord) {
        skippedPublicRuns += 1;
        continue;
      }

      const patch = buildMergePatch(existingRunRecord, sourceRecord);
      patch.isPublic = true;
      patch.publicSlug = normalizedSlug;

      await queueUpdate(runsRef.doc(existingRunIdBySlug), patch);
      runsById.set(existingRunIdBySlug, { ...existingRunRecord, ...patch });
      mergedFromPublicRuns += 1;
      continue;
    }

    const existingRunById = runsById.get(publicRunDoc.id);
    if (!existingRunById) {
      await queueSet(runsRef.doc(publicRunDoc.id), sourceRecord);
      runsById.set(publicRunDoc.id, sourceRecord);
      runIdBySlug.set(normalizedSlug, publicRunDoc.id);
      createdFromPublicRuns += 1;
      continue;
    }

    const existingRunSlug = existingRunById.publicSlug;
    if (!isString(existingRunSlug) || !existingRunSlug.trim()) {
      const patch = buildMergePatch(existingRunById, sourceRecord);
      patch.isPublic = true;
      patch.publicSlug = normalizedSlug;

      await queueUpdate(runsRef.doc(publicRunDoc.id), patch);
      runsById.set(publicRunDoc.id, { ...existingRunById, ...patch });
      runIdBySlug.set(normalizedSlug, publicRunDoc.id);
      mergedFromPublicRuns += 1;
      continue;
    }

    const generatedRunRef = runsRef.doc();
    await queueSet(generatedRunRef, sourceRecord);
    runsById.set(generatedRunRef.id, sourceRecord);
    runIdBySlug.set(normalizedSlug, generatedRunRef.id);
    createdFromPublicRuns += 1;
    publicRunIdConflicts += 1;
  }

  await flushBatch();

  console.log('Run migration complete');
  console.log(
    JSON.stringify(
      {
        normalizedRuns,
        createdFromEditorRuns,
        mergedFromEditorRuns,
        createdFromPublicRuns,
        mergedFromPublicRuns,
        skippedPublicRuns,
        publicRunIdConflicts,
        committedWrites,
      },
      null,
      2,
    ),
  );
};

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('Run migration failed', error);
    process.exit(1);
  });