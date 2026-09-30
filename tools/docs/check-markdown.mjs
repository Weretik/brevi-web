import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const docsRoot = resolve(workspaceRoot, 'docs');

function collectMarkdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return collectMarkdownFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

function displayPath(filePath) {
  return relative(workspaceRoot, filePath).replaceAll('\\', '/');
}

function withoutCodeBlocks(markdown) {
  return markdown.replace(/^```[\s\S]*?^```/gm, '');
}

function relativeLinkTargets(markdown) {
  return [...withoutCodeBlocks(markdown).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)]
    .map((match) => match[1].trim().replace(/^<|>$/g, ''))
    .filter((target) => target && !target.startsWith('#') && !/^[a-z][a-z\d+.-]*:/i.test(target));
}

const markdownFiles = collectMarkdownFiles(docsRoot);
const emptyFiles = markdownFiles.filter((filePath) => statSync(filePath).size === 0);
const brokenLinks = [];
const filesByHash = new Map();
const duplicateFiles = [];

for (const filePath of markdownFiles) {
  const contents = readFileSync(filePath, 'utf8');
  const hash = createHash('sha256').update(contents).digest('hex');
  const existingFile = filesByHash.get(hash);

  if (existingFile) {
    duplicateFiles.push([existingFile, filePath]);
  } else {
    filesByHash.set(hash, filePath);
  }

  for (const target of relativeLinkTargets(contents)) {
    const targetWithoutFragment = target.split('#', 1)[0];

    if (!targetWithoutFragment) {
      continue;
    }

    let decodedTarget;
    try {
      decodedTarget = decodeURIComponent(targetWithoutFragment);
    } catch {
      brokenLinks.push(`${displayPath(filePath)} -> ${target} (invalid URL encoding)`);
      continue;
    }

    if (!existsSync(resolve(dirname(filePath), decodedTarget))) {
      brokenLinks.push(`${displayPath(filePath)} -> ${target}`);
    }
  }
}

if (emptyFiles.length || duplicateFiles.length || brokenLinks.length) {
  for (const filePath of emptyFiles) {
    console.error(`Empty Markdown file: ${displayPath(filePath)}`);
  }
  for (const [firstFile, duplicateFile] of duplicateFiles) {
    console.error(
      `Duplicate Markdown files: ${displayPath(firstFile)} = ${displayPath(duplicateFile)}`,
    );
  }
  for (const brokenLink of brokenLinks) {
    console.error(`Broken relative link: ${brokenLink}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Markdown check passed: ${markdownFiles.length} files, no broken links, empty files or duplicates.`,
  );
}
