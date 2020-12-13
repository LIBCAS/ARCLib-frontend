export const storageTypes = {
  FS: 'FS',
  ZFS: 'ZFS',
  CEPH: 'CEPH',
};

export const storageTypesOptions = [
  { value: storageTypes.FS, label: storageTypes.FS },
  { value: storageTypes.ZFS, label: storageTypes.ZFS },
  { value: storageTypes.CEPH, label: storageTypes.CEPH },
];

export const storageSyncStatusPhases = {
  INIT: 'INIT',
  COPYING_ARCHIVED_OBJECTS: 'COPYING_ARCHIVED_OBJECTS',
  COPYING_NEW_OBJECTS: 'COPYING_NEW_OBJECTS',
  PROPAGATING_OPERATIONS: 'PROPAGATING_OPERATIONS',
  DONE: 'DONE',
};
