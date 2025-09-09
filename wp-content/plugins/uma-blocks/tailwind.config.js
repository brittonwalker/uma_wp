/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{html,js}'],
	theme: {
		screens: false,
		container: false,
		extend: {
			colors: {
				gold: '#C29832',
			},
		},
	},
};
