/*
Function finds table by tableId in userSettigs
if table is found, returns table settings
 */

export function getTableSettings(userSettings, tableId) {
  if (userSettings && userSettings.userSettings && userSettings.userSettings.tables) {
    const tableSettings = userSettings.userSettings.tables.find(
      (table) => table.tableId === tableId
    );
    return tableSettings;
  }
  return null;
}
