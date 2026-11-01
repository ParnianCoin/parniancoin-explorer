/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

/**
 * The consensus rules the explorer needs, mirrored from the node source.
 *
 *   CT_FirstReward            UConst.pas   1000000 TAR = 100 PARC
 *   CT_MinReward              UConst.pas     10000 TAR =   1 PARC
 *   CT_NewLineRewardDecrease  UConst.pas    210240 blocks between halvings
 *   CT_AccountsPerBlock       UConst.pas         5
 *   CT_Protocol_v3_PIP11_Percent  UConst.pas    20 % to the developer account
 *
 * Keep these in step with the node. If a constant changes there, every figure
 * derived here is wrong until it is changed here too.
 */

export const TAR_PER_PARC = 10000;
export const FIRST_REWARD_TAR = 1000000;
export const MIN_REWARD_TAR = 10000;
export const HALVING_INTERVAL = 210240;
export const ACCOUNTS_PER_BLOCK = 5;
export const DEV_REWARD_PERCENT = 20;

/**
 * The reward of a single block, in TAR. Mirrors GetRewardForNewLine: the
 * reward halves once per interval and never falls below the floor, which means
 * the supply keeps growing at a fixed rate once the floor is reached rather
 * than stopping at a cap.
 *
 * @param {Number} blockNumber
 * @returns {Number} reward in TAR
 */
export function rewardForBlock(blockNumber) {
  const halvings = Math.floor(blockNumber / HALVING_INTERVAL);

  let reward = FIRST_REWARD_TAR;
  for (let i = 0; i < halvings; i += 1) {
    reward = Math.floor(reward / 2);
  }

  return Math.max(reward, MIN_REWARD_TAR);
}

/**
 * Everything ever mined up to and including the given height, in TAR.
 *
 * Summed per halving era rather than block by block, so the figure stays exact
 * and cheap no matter how long the chain gets. Transaction fees are not new
 * coins — they move from the sender to the miner — so they are not counted.
 *
 * @param {Number} latestBlock
 * @returns {Number} total supply in TAR
 */
export function supplyUpTo(latestBlock) {
  if (latestBlock < 0) {
    return 0;
  }

  const blocks = latestBlock + 1;
  let total = 0;
  let mined = 0;

  while (mined < blocks) {
    const reward = rewardForBlock(mined);
    const eraEnd = (Math.floor(mined / HALVING_INTERVAL) + 1) * HALVING_INTERVAL;
    const inThisEra = Math.min(eraEnd, blocks) - mined;

    total += inThisEra * reward;
    mined += inThisEra;

    // Once the floor is reached every further block pays the same, so the rest
    // can be added in one step instead of looping over every era.
    if (reward === MIN_REWARD_TAR) {
      total += (blocks - mined) * MIN_REWARD_TAR;
      break;
    }
  }

  return total;
}

/**
 * The block that created a given account.
 *
 * @param {Number} accountNumber
 * @returns {Number}
 */
export function creatingBlock(accountNumber) {
  return Math.floor(accountNumber / ACCOUNTS_PER_BLOCK);
}

/**
 * Whether an account received the developer share rather than being a miner
 * account. GetRewardDistributionForNewBlock pays that share to the last of the
 * five accounts a block creates.
 *
 * The genesis block is excluded because the node explicitly skips the split
 * there, and so are blocks below protocol 3. The protocol version of the
 * creating block is not known from an account number alone, so accounts from
 * the very first blocks of the chain may be labelled as developer accounts
 * even though they were paid entirely to the miner.
 *
 * @param {Number} accountNumber
 * @returns {Boolean}
 */
export function isDeveloperAccount(accountNumber) {
  return accountNumber >= ACCOUNTS_PER_BLOCK
    && accountNumber % ACCOUNTS_PER_BLOCK === ACCOUNTS_PER_BLOCK - 1;
}

export default {
  TAR_PER_PARC,
  FIRST_REWARD_TAR,
  MIN_REWARD_TAR,
  HALVING_INTERVAL,
  ACCOUNTS_PER_BLOCK,
  DEV_REWARD_PERCENT,
  rewardForBlock,
  supplyUpTo,
  creatingBlock,
  isDeveloperAccount,
};
