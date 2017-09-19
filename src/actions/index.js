export const stageClear = (outcome) => {
  return {
    type: 'stage_clear',
    outcome: outcome // either success or fail
  };
};
