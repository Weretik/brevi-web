import { describe, expect, it } from 'vitest';

import {
  buildMediaFolderTree,
  mediaFolderAncestry,
  mediaFolderOptions,
  mediaFolderPath,
  mediaFolderSubtreeHeight,
} from './media-folder-tree';

import type { MediaFolder } from '../entities/media-folder';

const folders: MediaFolder[] = [
  { id: 3, name: 'Сумки', parentId: 1, fileCount: 2 },
  { id: 1, name: 'Товари', parentId: null, fileCount: 5 },
  { id: 2, name: 'Банери', parentId: null, fileCount: 0 },
  { id: 4, name: 'Шопери', parentId: 3, fileCount: 1 },
  { id: 9, name: 'Сирота', parentId: 77, fileCount: 1 },
];

describe('media folder tree', () => {
  it('nests folders, sorts by name and sums photos of subfolders', () => {
    const tree = buildMediaFolderTree(folders);
    expect(tree.map((node) => node.folder.name)).toEqual(['Банери', 'Сирота', 'Товари']);
    const goods = tree[2];
    expect(goods.totalCount).toBe(8);
    expect(goods.children[0].folder.name).toBe('Сумки');
    expect(goods.children[0].children[0].depth).toBe(3);
    expect(mediaFolderSubtreeHeight(goods)).toBe(3);
  });

  it('lists options with paths and can leave out a folder with its subfolders', () => {
    const tree = buildMediaFolderTree(folders);
    expect(mediaFolderOptions(tree).map((option) => option.path)).toEqual([
      'Банери',
      'Сирота',
      'Товари',
      'Товари / Сумки',
      'Товари / Сумки / Шопери',
    ]);
    expect(mediaFolderOptions(tree, 3).map((option) => option.id)).toEqual([2, 9, 1]);
  });

  it('builds the path from the root', () => {
    expect(mediaFolderAncestry(folders, 4)).toEqual([1, 3, 4]);
    expect(mediaFolderPath(folders, 4)).toBe('Товари / Сумки / Шопери');
    expect(mediaFolderPath(folders, null)).toBe('Без папки');
  });

  it('survives a cycle in broken data', () => {
    const cyclic: MediaFolder[] = [
      { id: 1, name: 'A', parentId: 2, fileCount: 0 },
      { id: 2, name: 'B', parentId: 1, fileCount: 0 },
    ];
    expect(buildMediaFolderTree(cyclic)).toEqual([]);
    expect(mediaFolderAncestry(cyclic, 1)).toEqual([2, 1]);
  });
});
