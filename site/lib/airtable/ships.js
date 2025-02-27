import base from "./base";

/** @typedef {import('airtable').FieldSet} FieldSet */

export const base_mechanic = "base_mechanic";

/**
 * @typedef {typeof base_mechanic} ShipType
 */

export const mac = "Mac";
export const windows = "Windows";
export const linux = "Linux";

/**
 * @typedef {typeof mac
 * | typeof windows
 * | typeof linux
 * } Platform
 */

/**
 * @typedef {FieldSet & {
 * ID: number;
 * Link: string;
 * Type: ShipType;
 * Notes?: string;
 * Platforms?: Platform[];
 * user?: string[];
 * created_at: string;
 * isDuplicate: boolean;
 * doesLinkWork: boolean;
 * gameName?: string;
 * gameImage?: string;
 * }} ShipsFieldSet
 */

/**
 * The 'Ships' table.
 * @type {import('airtable').Table<ShipsFieldSet>}
 * */
export const shipsTable = base('Ships');
