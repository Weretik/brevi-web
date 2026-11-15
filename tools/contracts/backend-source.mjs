import { execFileSync } from 'node:child_process';

import { contractUrl } from './backend-contract.mjs';

/** Downloads the generated contract of the backend at a branch or commit; the repositories are public. */
export async function downloadContract(source, ref) {
  const url = contractUrl(source, ref);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download ${url}: HTTP ${response.status}.`);
  return response.text();
}

/** The commit a branch points to, so the snapshot records exactly which backend version it is. */
export function resolveCommit(source, ref) {
  if (/^[0-9a-f]{40}$/.test(ref)) return ref;
  try {
    const output = execFileSync(
      'git',
      ['ls-remote', `https://github.com/${source.repository}.git`, `refs/heads/${ref}`],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    return output.split(/\s/)[0] || 'unknown (branch not found)';
  } catch {
    return 'unknown (GitHub unavailable)';
  }
}
