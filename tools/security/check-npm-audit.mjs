import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Same threshold as `npm audit --audit-level=high`, minus advisories listed in the allowlist.
const blockingSeverities = new Set(['high', 'critical']);
const allowlist = JSON.parse(
  readFileSync(new URL('./npm-audit-allowlist.json', import.meta.url), 'utf8'),
);
const allowed = new Set(allowlist.map((entry) => entry.advisory));

const npmCli = process.env.npm_execpath;
const command = npmCli ? process.execPath : 'npm';
const args = npmCli ? [npmCli, 'audit', '--json'] : ['audit', '--json'];

let output;
try {
  output = execFileSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (error) {
  // npm audit exits non-zero when it finds anything; the JSON report is still on stdout.
  if (!error.stdout) throw error;
  output = error.stdout;
}
const report = JSON.parse(output);

const blocking = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via !== 'object' || !blockingSeverities.has(via.severity)) continue;
    const advisory = via.url?.split('/').pop();
    if (allowed.has(advisory)) continue;
    blocking.set(
      `${via.name} ${advisory}`,
      `${via.severity}: ${via.name} ${via.range} — ${via.title} (${via.url})`,
    );
  }
}

for (const advisory of allowed) {
  const stillReported = Object.values(report.vulnerabilities ?? {}).some((vulnerability) =>
    vulnerability.via.some((via) => typeof via === 'object' && via.url?.endsWith(advisory)),
  );
  if (!stillReported)
    console.log(
      `Allowlisted advisory ${advisory} is no longer reported; remove it from npm-audit-allowlist.json.`,
    );
}

if (blocking.size) {
  for (const line of blocking.values()) console.log(line);
  console.log(`npm audit: ${blocking.size} high or critical advisories are not allowlisted.`);
  process.exitCode = 1;
} else {
  console.log(
    `npm audit: no high or critical advisories outside the allowlist (${allowed.size} allowlisted).`,
  );
}
