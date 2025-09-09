import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { Form } from '@components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({
		className: 'hero-lander',
	});

	const { title, subtitle, text, bgImage, heroImage } = attributes;

	return (
		<div {...blockProps}>
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
			<div
				className="hero-lander__bg"
				style={{
					backgroundImage: bgImage && bgImage.url ? `url(${bgImage.url})` : 'none',
				}}
			/>
			<div className="hero-lander__inner py-8">
				<div className="hero-lander__grid">
					<div className="hero-lander__left">
						<RichText
							tagName="h1"
							className="mt-0"
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('Hero Title', 'uma-blocks')}
						/>
						<RichText
							tagName="h2"
							value={subtitle}
							onChange={(value) => setAttributes({ subtitle: value })}
							placeholder={__('Hero Subtitle', 'uma-blocks')}
						/>
						<RichText
							tagName="p"
							value={text}
							onChange={(value) => setAttributes({ text: value })}
							placeholder={__('Hero Text', 'uma-blocks')}
						/>
						<Form />
					</div>
					<div className="hero-lander__right">
						<div className="hero-lander__image-wrapper aspect-[542/744] overflow-hidden">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										setAttributes({
											heroImage: {
												id: media.id,
												url: media.url,
											},
										});
									}}
									allowedTypes={['image']}
									value={heroImage.id}
									render={({ open }) => (
										<button
											className="hero-lander__image-button w-full h-full p-0 border-0 bg-transparent cursor-pointer"
											onClick={open}
										>
											{heroImage && heroImage.url ? (
												<img
													src={heroImage.url}
													alt={heroImage.alt}
													className="w-full h-full object-cover object-center rounded-2xl"
												/>
											) : (
												<div className="hero-lander__image-placeholder cursor-pointer bg-slate-300">
													{__('Set Image', 'uma-blocks')}
												</div>
											)}
										</button>
									)}
								/>
							</MediaUploadCheck>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
