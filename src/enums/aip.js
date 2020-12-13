export const aipStates = {
  ARCHIVED: 'ARCHIVED',
  // PROCESSED: null,
  REMOVED: 'REMOVED',
  DELETED: 'DELETED',
};

export const provenanceExtractedFromSipEventType = [
  { value: 'validation', label: 'validation' },
  { value: 'message digest calculation', label: 'message digest calculation' },
  { value: 'fixity check', label: 'fixity check' },
  { value: 'format identification', label: 'format identification' },
  { value: 'virus check', label: 'virus check' },
  { value: 'metadata extraction', label: 'metadata extraction' },
  { value: 'metadata modification', label: 'metadata modification' },
  { value: 'transfer', label: 'transfer' },
  { value: 'ingestion', label: 'ingestion' },
];

export const eventIdentifierType = [{ value: 'EventId', label: 'EventId' }];

export const agentIdentifierType = [{ value: 'AgentId', label: 'AgentId' }];
