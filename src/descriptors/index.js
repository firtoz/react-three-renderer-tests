module.exports = (type) => {
  require('./common')(type);
  require('./Texture')(type);
  require('./Resources')(type);
};
