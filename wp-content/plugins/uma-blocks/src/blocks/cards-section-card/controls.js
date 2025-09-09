import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	PanelRow,
	Popover,
	Button,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { link as linkIcon } from '@wordpress/icons';

export default function Controls({ attributes, setAttributes }) {
	const { bgImage, link } = attributes;
	const [showLinkPopover, setShowLinkPopover] = useState(false);

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
							value={bgImage?.id}
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
					<ToolbarButton
						icon={linkIcon}
						label={__('Add link', 'uma-blocks')}
						onClick={() => setShowLinkPopover(!showLinkPopover)}
						isPressed={!!link?.url}
					/>
					{showLinkPopover && (
						<Popover
							position="bottom center"
							onClose={() => setShowLinkPopover(false)}
							focusOnMount={false}
						>
							<div style={{ padding: '16px', minWidth: '280px' }}>
								<LinkControl
									value={link}
									onChange={(newLink) => {
										console.log(newLink);
										setAttributes({ link: newLink });
									}}
									onRemove={() => setAttributes({ link: {} })}
									settings={[
										{
											id: 'opensInNewTab',
											title: __('Open in new tab', 'uma-blocks'),
										},
									]}
								/>
							</div>
						</Popover>
					)}
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
