/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{ts,js,html,css,scss,json,md}': ['prettier --write'],
  '*.{ts,js}': ['eslint --fix'],
};
