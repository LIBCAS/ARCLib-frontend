import { languages, CZ, EN } from "./languages";

export const roles = {
  ROLE_ARCHIVIST: "ROLE_ARCHIVIST",
  ROLE_ADMIN: "ROLE_ADMIN",
  ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  ROLE_ANALYST: "ROLE_ANALYST",
  ROLE_EDITOR: "ROLE_EDITOR",
  ROLE_DELETION_ACKNOWLEDGE: "ROLE_DELETION_ACKNOWLEDGE"
};

export const rolesDescriptionsCZ = {
  [roles.ROLE_ARCHIVIST]: CZ.ARCHIVIST,
  [roles.ROLE_ADMIN]: CZ.ADMIN,
  [roles.ROLE_SUPER_ADMIN]: CZ.SUPER_ADMIN,
  [roles.ROLE_ANALYST]: CZ.ANALYST,
  [roles.ROLE_EDITOR]: CZ.EDITOR,
  [roles.ROLE_DELETION_ACKNOWLEDGE]: CZ.DELETION_ACKNOWLEDGE
};

export const rolesDescriptionsEN = {
  [roles.ROLE_ARCHIVIST]: EN.ARCHIVIST,
  [roles.ROLE_ADMIN]: EN.ADMIN,
  [roles.ROLE_SUPER_ADMIN]: EN.SUPER_ADMIN,
  [roles.ROLE_ANALYST]: EN.ANALYST,
  [roles.ROLE_EDITOR]: EN.EDITOR,
  [roles.ROLE_DELETION_ACKNOWLEDGE]: EN.DELETION_ACKNOWLEDGE
};

export const rolesDescriptions = {
  [languages.CZ]: rolesDescriptionsCZ,
  [languages.EN]: rolesDescriptionsEN
};

export const rolesOptions = [
  {
    id: "71f9dcb8-5a46-4735-abc4-853a98d9b0dd",
    name: roles.ROLE_SUPER_ADMIN,
    description: "super admin"
  },
  {
    id: "27029650-2658-47c2-92e7-12fd513735e0",
    name: roles.ROLE_ADMIN,
    description: "admin"
  },
  {
    id: "15ad12fb-9199-42d1-882e-600a4b401abd",
    name: roles.ROLE_ARCHIVIST,
    description: "archivist"
  },
  {
    id: "d3554950-28d6-4c92-91e4-f92a98bb8af0",
    name: roles.ROLE_ANALYST,
    description: "analyst"
  },
  {
    id: "50993bc1-178e-48c1-8ab6-79c00cdd359e",
    name: roles.ROLE_EDITOR,
    description: "editor"
  },
  {
    id: "1b5d1578-345f-43dd-a03f-9daf32518872",
    name: roles.ROLE_DELETION_ACKNOWLEDGE,
    description: "deletionacknowledge"
  }
];
