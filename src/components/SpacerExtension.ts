// extensions/SpacerExtension.ts
import { Node, mergeAttributes } from '@tiptap/core'

export const SpacerExtension = Node.create({
  name: 'spacer',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      height: {
        default: 40,
        parseHTML: el => parseInt(el.getAttribute('data-height') || '40', 10),
        renderHTML: attrs => ({
          'data-height': attrs.height,
          style: `height: ${attrs.height}px`,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="spacer"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'spacer' })]
  },
})
