import DOMPurify from 'dompurify';

const RICH_TEXT_CONFIG = {
	ALLOWED_TAGS: [
		'b',
		'strong',
		'i',
		'em',
		'u',
		's',
		'strike',
		'del',
		'span',
		'br',
		'p',
		'div',
	],
	ALLOWED_ATTR: ['style'],
};

export const sanitizeRichText = (html) =>
	DOMPurify.sanitize(html ?? '', RICH_TEXT_CONFIG);
