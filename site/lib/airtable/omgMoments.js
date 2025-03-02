import base from './base';

/** @typedef {import('airtable').FieldSet} FieldSet */

/**
 * @typedef {FieldSet & {
 * description: string;
 * video?: string;
 * email?: string;
 * juiceStretches?: string[];
 * Review: import('./juiceStretches').ReviewStatus;
 * jungleStretches?: string[];
 * notes?: string;
 * created_at: string;
 * kudos: number;
 * ["Slack ID"]?: string;
 * }} OmgMomentsFieldSet
 */

/**
 * The 'omgMoments' table.
 * @type {import('airtable').Table<OmgMomentsFieldSet>}
 */
export const omgMomentsTable = base('omgMoments');
