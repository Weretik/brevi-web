import StarterKit from '@tiptap/starter-kit';

/**
 * What a site text may contain: paragraphs, one level of headings, bulleted lists, bold, and italic.
 * Everything else of the starter kit is off, so pasted text cannot bring formatting the site does not show.
 */
export const richTextExtensions = [
  StarterKit.configure({
    heading: { levels: [2] },
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    link: false,
    orderedList: false,
    strike: false,
    underline: false,
  }),
];
