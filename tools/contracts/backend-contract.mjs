/** Where the frontend takes the backend API contract from, and how a snapshot is compared with it. */
export const backend = {
  repository: 'Weretik/BreviERP',
  branch: 'master',
  contractPath: 'docs/sdd/contracts/openapi.json',
  snapshotDirectory: 'docs/contracts/openapi',
  generatedTypes: 'libs/admin/shared/contracts/src/generated/openapi.ts',
};

export const contractUrl = (source, ref) =>
  `https://raw.githubusercontent.com/${source.repository}/${ref}/${source.contractPath}`;

/** Parses the document and writes it back with stable formatting, so line endings and spacing never count as a change. */
export function normalizeContract(text) {
  let document;
  try {
    document = JSON.parse(text);
  } catch (error) {
    throw new Error('The backend contract is not valid JSON.', { cause: error });
  }
  if (typeof document?.openapi !== 'string' || typeof document.paths !== 'object') {
    throw new Error('The backend contract is not an OpenAPI document.');
  }
  return `${JSON.stringify(document, null, 2)}\n`;
}

/** Says whether the snapshot equals the backend contract and, when not, which paths were added or removed. */
export function compareSnapshot(snapshotText, contractText) {
  const snapshot = normalizeContract(snapshotText);
  const contract = normalizeContract(contractText);
  if (snapshot === contract) return { current: true };
  const snapshotPaths = Object.keys(JSON.parse(snapshot).paths);
  const contractPaths = Object.keys(JSON.parse(contract).paths);
  return {
    current: false,
    added: contractPaths.filter((path) => !snapshotPaths.includes(path)),
    removed: snapshotPaths.filter((path) => !contractPaths.includes(path)),
  };
}

export const sourceDocument = (source, { ref, commit }) => `# Backend OpenAPI snapshot

- Repository: \`${source.repository}\`
- Source: \`${source.contractPath}\` (generated from the backend code on every build)
- Ref: \`${ref}\`
- Commit: \`${commit}\`

This directory is machine-managed; do not edit it by hand. Refresh it from the backend default branch with:

\`\`\`text
npm run contracts:sync
\`\`\`
`;
