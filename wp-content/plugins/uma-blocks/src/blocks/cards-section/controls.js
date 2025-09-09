import { __ } from '@wordpress/i18n';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, PanelBody, PanelRow } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';

export default function Controls({ clientId }) {
	const { insertBlock } = useDispatch('core/block-editor');
	const onAddCard = () => {
		const blockToInsert = createBlock('uma-blocks/cards-section-card');
		insertBlock(blockToInsert, undefined, clientId);
	};
	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						className="components-toolbar__control"
						label={__('Add Testimonial', 'uma-blocks')}
						icon="plus"
						onClick={onAddCard}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls className="">
				<PanelBody title={__('Block Settings', 'uma-blocks')}>
					<PanelRow></PanelRow>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
