import type { MediaFolder } from '../entities/media-folder';

export interface MediaFolderNode {
  folder: MediaFolder;
  depth: number;
  children: MediaFolderNode[];
  /** Photos in this folder and all its subfolders. */
  totalCount: number;
}

export interface MediaFolderOption {
  id: number;
  name: string;
  depth: number;
  path: string;
}

const byName = (left: MediaFolder, right: MediaFolder) =>
  left.name.localeCompare(right.name, 'uk-UA', { sensitivity: 'base' });

/** Builds the tree from the flat list; folders whose parent is missing become roots. */
export function buildMediaFolderTree(folders: readonly MediaFolder[]): MediaFolderNode[] {
  const ids = new Set(folders.map((folder) => folder.id));
  const children = new Map<number | null, MediaFolder[]>();
  for (const folder of folders) {
    const parent = folder.parentId !== null && ids.has(folder.parentId) ? folder.parentId : null;
    children.set(parent, [...(children.get(parent) ?? []), folder]);
  }

  const build = (parentId: number | null, depth: number, seen: Set<number>): MediaFolderNode[] =>
    [...(children.get(parentId) ?? [])]
      .filter((folder) => !seen.has(folder.id))
      .sort(byName)
      .map((folder) => {
        const nested = build(folder.id, depth + 1, new Set([...seen, folder.id]));
        return {
          folder,
          depth,
          children: nested,
          totalCount: folder.fileCount + nested.reduce((sum, node) => sum + node.totalCount, 0),
        };
      });

  return build(null, 1, new Set());
}

/** Depth-first list for selects: «Товари», «Товари / Сумки», … */
export function mediaFolderOptions(
  tree: readonly MediaFolderNode[],
  excludeWithDescendantsOf: number | null = null,
): MediaFolderOption[] {
  const options: MediaFolderOption[] = [];
  const walk = (nodes: readonly MediaFolderNode[], prefix: string) => {
    for (const node of nodes) {
      if (node.folder.id === excludeWithDescendantsOf) continue;
      const path = prefix ? `${prefix} / ${node.folder.name}` : node.folder.name;
      options.push({ id: node.folder.id, name: node.folder.name, depth: node.depth, path });
      walk(node.children, path);
    }
  };
  walk(tree, '');
  return options;
}

export function findMediaFolderNode(
  tree: readonly MediaFolderNode[],
  id: number,
): MediaFolderNode | null {
  for (const node of tree) {
    if (node.folder.id === id) return node;
    const nested = findMediaFolderNode(node.children, id);
    if (nested) return nested;
  }
  return null;
}

/** Ids from the root to the folder, including it; empty when the folder is unknown. */
export function mediaFolderAncestry(folders: readonly MediaFolder[], id: number): number[] {
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const chain: number[] = [];
  let current = byId.get(id);
  while (current && !chain.includes(current.id)) {
    chain.unshift(current.id);
    current = current.parentId === null ? undefined : byId.get(current.parentId);
  }
  return chain;
}

export function mediaFolderPath(folders: readonly MediaFolder[], id: number | null): string {
  if (id === null) return 'Без папки';
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const names = mediaFolderAncestry(folders, id).map((folderId) => byId.get(folderId)?.name);
  return names.length > 0 ? names.join(' / ') : `Папка #${id}`;
}

/** Height of the subtree, counting the folder itself as 1. */
export function mediaFolderSubtreeHeight(node: MediaFolderNode): number {
  return 1 + Math.max(0, ...node.children.map(mediaFolderSubtreeHeight));
}
