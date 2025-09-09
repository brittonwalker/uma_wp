import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import { Form } from '@components';
import Controls from './controls';
import './editor.scss';

export default function Edit(props) {
	const {
		attributes: { title, subtitle, text },
		setAttributes,
	} = props;
	const blockProps = useBlockProps({
		className: 'hero-lander',
	});

	return (
		<div {...blockProps}>
			<Controls {...props} />
			<div className="container py-8">
				<div className="grid grid-cols-2 gap-10">
					<div className="">
						<RichText
							tagName="h1"
							className="mt-0"
							value={title}
							onChange={(value) => setAttributes({ title: value })}
							placeholder={__('CTA Title', 'uma-blocks')}
						/>
						<RichText
							tagName="h2"
							value={subtitle}
							onChange={(value) => setAttributes({ subtitle: value })}
							placeholder={__('CTA Subtitle', 'uma-blocks')}
						/>
						<RichText
							tagName="p"
							value={text}
							onChange={(value) => setAttributes({ text: value })}
							placeholder={__('Enter your text here…', 'uma-blocks')}
						/>
					</div>
					<div className="flex justify-center">
						<Form />
					</div>
				</div>
			</div>
		</div>
	);
}
