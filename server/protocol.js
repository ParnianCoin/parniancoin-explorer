/*
 * Copyright (c) 2026 by Amir Reza Zamani
 * This file is a part of the ParnianCoin Project, an infinitely scalable
 * cryptocurrency. Find us here:
 * Web: https://parniancoin.com
 * THIS LICENSE HEADER MUST NOT BE REMOVED.
 */

/**
 * The consensus constants, mirrored from the node source (UConst.pas) and the
 * reward function GetRewardForNewLine in UAccounts.pas. Keep in step with the
 * node: if a constant changes there, every figure derived here is wrong until
 * it is changed here too.
 */

const TAR_PER_PARC = 10000;
const FIRST_REWARD_TAR = 1000000; // CT_FirstReward — 100 PARC
const MIN_REWARD_TAR = 10000; // CT_MinReward — 1 PARC
const HALVING_INTERVAL = 210240; // CT_NewLineRewardDecrease
const ACCOUNTS_PER_BLOCK = 5; // CT_AccountsPerBlock
const DEV_REWARD_PERCENT = 20; // CT_Protocol_v3_PIP11_Percent

/**
 * Reward of a single block, in TAR.
 */
function rewardForBlock(blockNumber) {
  const halvings = Math.floor(blockNumber / HALVING_INTERVAL);

  let reward = FIRST_REWARD_TAR;
  for (let i = 0; i < halvings; i += 1) {
    reward = Math.floor(reward / 2);
  }

  return Math.max(reward, MIN_REWARD_TAR);
}

/**
 * Everything mined up to and including the given height, in TAR. Summed per
 * halving era so the figure stays exact and cheap however long the chain gets.
 * Transaction fees are not counted: they move coins, they do not create them.
 */
function supplyUpTo(latestBlock) {
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

    if (reward === MIN_REWARD_TAR) {
      total += (blocks - mined) * MIN_REWARD_TAR;
      break;
    }
  }

  return total;
}

module.exports = {
  TAR_PER_PARC,
  FIRST_REWARD_TAR,
  MIN_REWARD_TAR,
  HALVING_INTERVAL,
  ACCOUNTS_PER_BLOCK,
  DEV_REWARD_PERCENT,
  rewardForBlock,
  supplyUpTo,
};
