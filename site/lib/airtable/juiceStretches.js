import base from './base';

/** @typedef {import('airtable').FieldSet} FieldSet */

export const pending = "Pending";
export const accepted = "Accepted";
export const rejected = "Rejected";

/**
 * @typedef {typeof pending
 * | typeof accepted
 * | typeof rejected
 * } ReviewStatus
 */

/**
 * @typedef {FieldSet & {
 * ID: string;
 * Review: ReviewStatus;
 * ["email (from Signups)"]: string;
 * startTime?: string;
 * endTime?: string;
 * omgMoments?: string[];
 * ["video (from omgMoments)"]: string;
 * ["description (from omgMoments)"]: string;
 * Signups: string[];
 * pauseTimeStart?: string;
 * totalPauseTimeSeconds: number;
 * isCancelled: boolean;
 * timeWorkedSeconds: number;
 * timeWorkedHours: number;
 * ["Slack ID"]?: string;
 * isOffline: boolean;
 * }} JuiceStretchesFieldSet 
 */

/**
 * The 'juiceStretches' table.
 * @type {import('airtable').Table<JuiceStretchesFieldSet>}
 */
export const juiceStretchesTable = base('juiceStretches');


const x = juiceStretchesTable.select()


