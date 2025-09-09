import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, PanelBody, PanelRow } from '@wordpress/components';

export default function Controls({ attributes, setAttributes }) {
	const { bgImage } = attributes;
	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) => {
								setAttributes({
									bgImage: {
										id: media.id,
										url: media.url,
									},
								});
							}}
							allowedTypes={['image']}
							value={bgImage.id}
							render={({ open }) => (
								<ToolbarButton
									className="components-toolbar__control"
									label={__('Edit background image', 'uma-blocks')}
									icon="format-image"
									onClick={open}
								/>
							)}
						/>
					</MediaUploadCheck>
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
