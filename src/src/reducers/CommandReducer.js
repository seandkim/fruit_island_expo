export default (state = null, action) => {
  switch (action.type) {
    case 'stage_clear':
      console.log("state is", state)
      if (action.outcome === "success") {
        return state+1;
      } else if (action.outcome === "failure") {
        return state;
      }
    default:
      return state;
  }
};
