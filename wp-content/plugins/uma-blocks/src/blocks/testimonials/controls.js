import { __ } from '@wordpress/i18n';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, PanelBody, PanelRow } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

export default function Controls({ clientId }) {
	const { insertBlock } = useDispatch('core/block-editor');
	const onAddTestimonial = () => {
		const blockToInsert = createBlock('uma-blocks/testimonial');
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
						onClick={onAddTestimonial}
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
