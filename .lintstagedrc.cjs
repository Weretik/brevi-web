/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{ts,js,html,css,scss,json,md}': ['npx prettier --write'],
  '*.{ts,js}': ['npx eslint --fix'],
};
