import { __ } from '@wordpress/i18n';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { ToolbarGroup, PanelBody, PanelRow } from '@wordpress/components';

export default function Controls() {
	return (
		<>
			<BlockControls>
				<ToolbarGroup></ToolbarGroup>
			</BlockControls>
			<InspectorControls className="">
				<PanelBody title={__('Block Settings', 'uma-blocks')}>
					<PanelRow></PanelRow>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
