import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import Controls from './controls';
import './editor.scss';

export default function Edit(props) {
	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: 'testimonials',
		},
		{
			allowedBlocks: ['uma-blocks/testimonial'],
			template: [['uma-blocks/testimonial']],
		},
	);
	return (
		<>
			<Controls {...props} />
			<div {...useBlockProps()}>
				<div {...innerBlocksProps}>{children}</div>
			</div>
		</>
	);
}
