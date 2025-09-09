const { join } = require( 'path' );

module.exports = {
	blockTemplatesPath: join( __dirname, 'block-templates' ),
	defaultValues: {
		title: 'TKTK Example Block',
		description:
			'This is an example block generated from the create-block command.',
		category: 'tktk-blocks',
		icon: 'smiley',
		render: 'file:./render.php',
	},
};
