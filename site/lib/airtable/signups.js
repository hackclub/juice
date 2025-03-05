import base from './base';

/** @typedef {import('airtable').FieldSet} FieldSet */

export const account_created = "account_created";
export const pr_submitted = "pr_submitted";
export const pr_merged = "pr_merged";
export const poc_submitted = "poc_submitted";
export const poc_accepted = "poc_accepted";

/**
 * @typedef {typeof account_created
 * | typeof pr_submitted
 * | typeof pr_merged
 * | typeof poc_submitted
 * | typeof poc_accepted
 * } Achievement
 */

export const invite_orange = "orange";
export const invite_apple = "apple";
export const invite_kiwi = "kiwi";

/**
 * @typedef {typeof invite_orange
 * | typeof invite_apple
 * | typeof invite_kiwi
 * } Invite
 */

/**
 * @typedef {FieldSet & {
 * email: string;
 * token: string;
 * created_at: string;
 * game_pr?: string;
 * achievements: Achievement[];
 * invitesAvailable?: Invite[];
 * juiceStretches?: string[];
 * totalJuiceHours: number;
 * Ships?: string[];
 * jungleStretches?: string[];
 * totalJungleHours: number;
 * jungleBossesFought?: string[];
 * Slack?: string[];
 * ["Slack Handle (from Slack)"]: string[];
 * ["Slack ID (from Slack)"]: string[];
 * ["Email (from Slack)"]: string[];
 * inChannel: boolean;
 * Tamagotchi?: string[];
 * }} SignupsFieldSet
 */

/**
 * The 'Signups' table.
 * @type {import('airtable').Table<SignupsFieldSet>}
 */
export const signupsTable = base('Signups');
