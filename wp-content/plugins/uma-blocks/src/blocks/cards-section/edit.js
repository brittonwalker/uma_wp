import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';

import Controls from './controls';
import './editor.scss';

export default function Edit(props) {
	const {
		attributes: { title },
	} = props;
	const blockProps = useBlockProps({
		className: 'container-wide',
	});
	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: 'grid grid-cols-3 gap-5',
		},
		{
			allowedBlocks: ['uma-blocks/cards-section-card'],
			template: [
				['uma-blocks/cards-section-card'],
				['uma-blocks/cards-section-card'],
				['uma-blocks/cards-section-card'],
			],
		},
	);
	return (
		<>
			<Controls {...props} />
			<div {...blockProps}>
				<RichText
					tagName="h2"
					className="text-5xl font-bold text-center mb-10"
					placeholder="Add Title..."
					value={title}
					onChange={(value) => props.setAttributes({ title: value })}
				/>
				<div {...innerBlocksProps}>{children}</div>
			</div>
		</>
	);
}
