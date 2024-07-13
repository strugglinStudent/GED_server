const types = {
  super: 'super',
  external: 'external',
  internal: 'internal',
};
Object.freeze(types);
const natures = {
  moral: 'moral',
  physical: 'physical',
};
Object.freeze(natures);
const userState = {
  newInvalidCode: 'newInvalidCode',
  old: 'old',
};
Object.freeze(userState);
const featureStatus = {
  active: 'active',
  notActive: 'notActive',
};
Object.freeze(featureStatus);

module.exports = {
  types, natures, userState, featureStatus,
};
