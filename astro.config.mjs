// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';

// Wraps `![alt](src "caption")` images in a <figure>/<figcaption> so the
// title text renders as a visible caption. Images without a title are
// left untouched.
function remarkFigureCaptions() {
	/** @param {import('mdast').Root} tree */
	return (tree) => {
		visit(tree, 'image', (node, index, parent) => {
			if (!node.title || typeof index !== 'number' || !parent) return;
			/** @type {any} */
			const figure = {
				type: 'paragraph',
				data: { hName: 'figure' },
				children: [
					node,
					{
						type: 'paragraph',
						data: { hName: 'figcaption' },
						children: [{ type: 'text', value: node.title }],
					},
				],
			};
			parent.children.splice(index, 1, figure);
		});
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://tr-edge.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkFigureCaptions],
	},
});
