import { buildMediaFolderTree } from '@admin/media/model';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MediaFolderTree } from './media-folder-tree';

const tree = buildMediaFolderTree([
  { id: 1, name: 'Товари', parentId: null, fileCount: 2 },
  { id: 2, name: 'Сумки', parentId: 1, fileCount: 3 },
]);

afterEach(cleanup);

describe('MediaFolderTree', () => {
  it('marks the open folder, shows counts with subfolders and expands on demand', () => {
    const onToggle = vi.fn();
    const onSelect = vi.fn();
    render(
      <MediaFolderTree
        tree={tree}
        selectedId={1}
        expandedIds={new Set()}
        totalCount={null}
        onSelect={onSelect}
        onToggle={onToggle}
        onAction={vi.fn()}
      />,
    );

    const goods = screen.getByRole('button', { name: /^Товари\s*5$/ });
    expect(goods).toHaveAttribute('aria-current', 'true');
    expect(screen.queryByRole('button', { name: /^Сумки/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути «Товари»' }));
    expect(onToggle).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: /^Усі фото$/ }));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
