var _ = require('lodash');

function createBoss(bossname) {
  var boss = {
    addConstituent: addConstituent,
    addFn: addFn,
    fns: {}
  };

  function addConstituent(constituentName) {
    boss[constituentName] = {
      providers: {}
    };
  }

  function addConstituentIfNotThere(constituentName) {
    if (!(constituentName in boss)) {
      addConstituent(constituentName);
    }
  }

  function addProviderForConstituent(provider, constituent) {
    debugger;
    boss[constituent].providers[provider.name] = provider;
  }

  function addFn(opts) {
    boss.fns[opts.fn.name] = opts.fn;

    _.keys(opts.providers).forEach(addConstituentIfNotThere);
    _.each(opts.providers, addProviderForConstituent);
  }

  return boss;
}

module.exports = {
  createBoss: createBoss
};
