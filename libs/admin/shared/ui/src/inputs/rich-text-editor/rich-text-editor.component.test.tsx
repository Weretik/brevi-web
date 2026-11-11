import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RichTextEditor } from './rich-text-editor';

import type { RichTextDocument } from './rich-text-editor';

const doc: RichTextDocument = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Опис' }] },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Куртка:', marks: [{ type: 'bold' }] },
        { type: 'text', text: ' пряма.' },
      ],
    },
  ],
};

describe('RichTextEditor', () => {
  it('shows the text formatted, with a labelled field and a toolbar', () => {
    render(<RichTextEditor label="Опис" initialValue={doc} onChange={vi.fn()} />);

    const field = screen.getByRole('textbox', { name: 'Опис' });
    expect(field.querySelector('h2')).toHaveTextContent('Опис');
    expect(field.querySelector('strong')).toHaveTextContent('Куртка:');
    const toolbar = screen.getByRole('toolbar', { name: 'Форматування тексту' });
    expect(toolbar).toBeInTheDocument();
    for (const name of ['Заголовок', 'Жирний', 'Курсив', 'Список']) {
      expect(screen.getByRole('button', { name })).toBeEnabled();
    }
  });

  it('turns the paragraph into a list with a toolbar button and reports the document', async () => {
    const onChange = vi.fn();
    render(<RichTextEditor label="Опис" initialValue={doc} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Список' }));

    const saved = onChange.mock.lastCall?.[0] as RichTextDocument;
    expect(saved.content?.map((node) => node.type)).toContain('bulletList');
  });

  it('locks the toolbar and the text while saving', () => {
    render(<RichTextEditor label="Опис" initialValue={doc} onChange={vi.fn()} disabled />);

    expect(screen.getByRole('textbox', { name: 'Опис' })).toHaveAttribute(
      'contenteditable',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Жирний' })).toBeDisabled();
  });
});
