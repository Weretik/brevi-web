module.exports = async (req, res) => {
  const mod = await import('../dist/apps/storefront/server/server.mjs');

  const ssr = mod.reqHandler ?? mod.default ?? mod.app;

  if (!ssr) {
    res.statusCode = 500;
    res.end('Angular SSR handler not found.');
    return;
  }

  return ssr(req, res);
};
