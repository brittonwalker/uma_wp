import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Icon, image } from '@wordpress/icons';

import Star from '@svg/star';

import Controls from './controls';
import './editor.scss';

export default function Edit(props) {
	const {
		attributes: { author },
	} = props;
	const blockProps = useBlockProps({
		className: 'my-8',
	});
	const { children, innerBlocksProps } = useInnerBlocksProps(blockProps, {
		allowedBlocks: ['core/paragraph'],
		template: [['core/paragraph', { placeholder: 'Write testimonial...' }]],
	});
	return (
		<>
			<Controls {...props} />
			<div {...blockProps}>
				<div className="container">
					<div className="flex gap-1">
						{Array(5)
							.fill()
							.map((_, i) => (
								<Star key={i} />
							))}
					</div>
					<div {...innerBlocksProps} className="my-8 text-5xl">
						{children}
					</div>
					<div className="flex items-center gap-4 text-[18px] mt-12">
						<div className="w-14 h-14 rounded-full overflow-hidden bg-red-400">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										props.setAttributes({ author: { ...author, image: media } });
									}}
									allowedTypes={['image']}
									value={author?.image?.id}
									render={({ open }) => (
										<button
											onClick={open}
											className="w-full h-full appearance-none bg-transparent border-0 p-0 flex items-center justify-center hover:cursor-pointer"
										>
											{author?.image ? (
												<img
													src={author.image.url}
													alt={__('Author Image', 'uma-blocks')}
													className="object-cover w-full h-full"
												/>
											) : (
												<Icon icon={image} />
											)}
										</button>
									)}
								/>
							</MediaUploadCheck>
						</div>
						<div className="flex flex-col gap-0.5 [&>*]:m-0">
							<RichText
								tagName="p"
								className="font-bold"
								placeholder="Author Name"
								value={author?.name || ''}
								onChange={(value) => props.setAttributes({ author: { ...author, name: value } })}
							/>
							<RichText
								tagName="p"
								className="text-secondary"
								placeholder="Author Role"
								value={author?.role || ''}
								onChange={(value) => props.setAttributes({ author: { ...author, role: value } })}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
