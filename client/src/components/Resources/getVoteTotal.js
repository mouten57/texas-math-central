const getVoteTotal = (resources) => {
  const myFunc = (acc, curr) => {
    return Number(acc.value) + Number(curr.value);
  };

  //get vote total for each resource
  for (let i in resources) {
    if (resources[i].votes.length == 1 && resources[i].votes.length) {
      var voteTotal = resources[i].votes[0].value;
    } else if (resources[i].votes.length > 1) {
      var voteTotal = resources[i].votes.reduce(myFunc);
    } else {
      var voteTotal = 0;
    }
    resources[i].voteTotal = voteTotal;
  }
  return resources;
};

export default getVoteTotal;
