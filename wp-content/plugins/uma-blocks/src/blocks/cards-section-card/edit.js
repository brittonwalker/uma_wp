import { useBlockProps, RichText } from '@wordpress/block-editor';

import Controls from './controls';
import './editor.scss';

export default function Edit(props) {
	const { bgImage, title, content } = props.attributes;
	const blockProps = useBlockProps();

	console.log(bgImage);
	return (
		<>
			<Controls {...props} />
			<div {...blockProps}>
				<div
					className="aspect-[447/598] bg-slate-200 rounded-2xl w-full bg-cover bg-center bg-no-repeat relative flex items-end"
					style={{ backgroundImage: `url(${bgImage.url})` }}
				>
					<div
						className="card-info text-sm text-center w-full rounded-2xl px-6 py-5 mb-3 mx-2 text-white bg-cover bg-center bg-no-repeat bg-blend-darken"
						style={{ background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(5px)' }}
					>
						<RichText
							tagName="h2"
							className="text-4xl font-heading font-bold mb-5 mt-0"
							value={title}
							placeholder="Card Title"
							onChange={(value) => props.setAttributes({ title: value })}
						/>
						<RichText
							tagName="div"
							className=""
							value={content}
							placeholder="Card content"
							onChange={(value) => props.setAttributes({ content: value })}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
