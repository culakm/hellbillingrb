import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import { decimalToDMS, tripFileName } from '@/utils';

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const parseHtml = (html) => {
	if (!html) return { text: '' };
	const converted = htmlToPdfmake(html, { removeExtraBlanks: true });
	return { text: converted };
};

const svgCache = new Map();

const loadSvg = async (path) => {
	if (svgCache.has(path)) return svgCache.get(path);
	const res = await fetch(path);
	const text = await res.text();
	svgCache.set(path, text);
	return text;
};

const INTEREST_ICONS = {
	stop: { path: '/img/interest_stop_transparent.svg', color: '#e53935' },
	culture: { path: '/img/interest_c_transparent.svg', color: '#f5c518' },
	history: { path: '/img/interest_h_transparent.svg', color: '#8b5e3c' },
	sport: { path: '/img/interest_s_transparent.svg', color: '#2979ff' },
};

const buildTagCell = (color, svg) => {
	const withCircle = svg.replace(/<svg([^>]*)>/i, (match, attrs) => {
		const vb = attrs.match(/viewBox\s*=\s*["']([^"']+)["']/i);
		let cx = 7;
		let cy = 7;
		let r = 7;
		if (vb) {
			const [minX, minY, w, h] = vb[1].trim().split(/[\s,]+/).map(Number);
			cx = minX + w / 2;
			cy = minY + h / 2;
			r = Math.min(w, h) / 2;
		}
		return `${match}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
	});
	return {
		svg: withCircle,
		width: 14,
		height: 14,
	};
};

const buildPointCell = (line) => {
	const tagCells = [];
	for (const key of ['stop', 'culture', 'history', 'sport']) {
		if (line[key]) {
			const icon = INTEREST_ICONS[key];
			tagCells.push(buildTagCell(icon.color, svgCache.get(icon.path)));
		}
	}

	return {
		stack: [
			{
				columns: [
					{ text: line.name || '', alignment: 'left', bold: true },
					{
						text: line.lat ? decimalToDMS(line.lat) : '',
						width: 'auto',
					},
					{
						text: line.lng ? decimalToDMS(line.lng, false) : '',
						width: 'auto',
					},
				],
				columnGap: 6,
			},
			tagCells.length
				? { columns: tagCells, columnGap: 4, marginTop: 3 }
				: { text: '' },
		],
	};
};

const buildDistanceCell = (line, total) => {
	const kmTotalText =
		typeof line.kmTotal === 'number' && line.kmTotal >= 0
			? line.kmTotal + ' Km'
			: '--';
	const dssAss =
		line.order === 1 ? 'DSS' : line.order === total ? 'ASS' : '';
	const kmPartText = line.kmPart > 0 ? line.kmPart + ' Km' : '--';

	return {
		table: {
			widths: ['*', '*'],
			body: [
				[
					{
						text: kmTotalText,
						colSpan: 2,
						alignment: 'center',
						style: 'kmTotal',
					},
					{},
				],
				[
					{ text: dssAss, alignment: 'center', bold: true },
					{
						text: kmPartText,
						alignment: 'center',
						border: [true, true, false, false],
					},
				],
			],
		},
		layout: { defaultBorder: false },
	};
};

const buildTulipCell = (line) => {
	const tulipSvg = line.tulip ? svgCache.get(`/img/${line.tulip}.svg`) : null;
	if (tulipSvg && line.close) {
		return {
			columns: [
				{
					text: '!',
					color: '#e53935',
					bold: true,
					fontSize: 14,
					width: 'auto',
					alignment: 'right',
				},
				{ svg: tulipSvg, width: 50, height: 35, alignment: 'center' },
			],
			columnGap: 4,
			colSpan: 2,
		};
	}
	if (tulipSvg) {
		return {
			svg: tulipSvg,
			width: 50,
			height: 35,
			alignment: 'center',
			colSpan: 2,
		};
	}
	return {
		text: line.close ? '!' : '',
		color: '#e53935',
		bold: true,
		alignment: 'center',
		colSpan: 2,
	};
};

export const usePdfExport = () => {
	const downloadTCRPdf = (lines, tripName) => {
		const docDefinition = {
			content: [
				{ text: 'Lines Report', style: 'title' },
				{
					table: {
						headerRows: 1,
						dontBreakRows: true,
						keepWithHeaderRows: 1,
						widths: [20, 70, 70, '*', 20],
						body: [
							[
								{ text: 'No.', style: 'tableHeader' },
								{ text: 'Coordinates', style: 'tableHeader', colSpan: 2 },
								{},
								{ text: 'Note', style: 'tableHeader' },
								{ text: 'X', style: 'tableHeader' },
							],
							...lines.map((line) => {
								const note = parseHtml(line.note);
								const hasCoords = line.lat && line.lng;
								const hasCheck = line.stop;
								if (hasCoords && hasCheck) {
									return [
										{ text: String(line.order), alignment: 'center' },
										decimalToDMS(line.lat),
										decimalToDMS(line.lng, false),
										note,
										{ text: '', alignment: 'center' },
									];
								}
								if (hasCoords && !hasCheck) {
									return [
										{ text: String(line.order), alignment: 'center' },
										decimalToDMS(line.lat),
										decimalToDMS(line.lng, false),
										{ ...note, colSpan: 2 },
										{},
									];
								}
								if (!hasCoords && hasCheck) {
									return [
										{ text: String(line.order), alignment: 'center' },
										{ ...note, colSpan: 3 },
										{},
										{},
										{ text: '', alignment: 'center' },
									];
								}
								return [
									{ text: String(line.order), alignment: 'center' },
									{ ...note, colSpan: 4 },
									{},
									{},
									{},
								];
							}),
						],
					},
					layout: 'grid',
				},
			],
			styles: {
				title: { fontSize: 18, bold: true, marginBottom: 12 },
				tableHeader: { bold: true, fontSize: 11, color: '#333333' },
			},
			defaultStyle: { fontSize: 10 },
		};

		pdfMake.createPdf(docDefinition).download(tripFileName(tripName) + '.pdf');
	};

	const downloadPdf = async (lines, tripName) => {
		const tulipNames = new Set(lines.map((l) => l.tulip).filter(Boolean));
		await Promise.all([
			...Object.values(INTEREST_ICONS).map((i) => loadSvg(i.path)),
			...[...tulipNames].map((name) => loadSvg(`/img/${name}.svg`)),
		]);

		const total = lines.length;
		const widths = ['5%', '10%', '15%', '30%', '15%', '25%'];
		const lineBlockLayout = {
			hLineWidth: (i, node) =>
				i === 0 || i === node.table.body.length ? 1.5 : 0.5,
			vLineWidth: (i, node) =>
				i === 0 || i === node.table.widths.length ? 1.5 : 0.5,
			hLineColor: () => '#000',
			vLineColor: () => '#000',
		};
		const lineBlocks = lines.map((line) => ({
			unbreakable: true,
			table: {
				widths,
				body: [
					[
						{ text: String(line.order), alignment: 'center', bold: true },
						{ ...buildPointCell(line), colSpan: 3 },
						{},
						{},
						{
							stack: [
								{ text: 'Map Page', style: 'cellLabel' },
								{
									text: line.mapPage ? line.mapPage.replace(/,/g, ' ') : '',
									fontSize: 8.5,
								},
							],
						},
						buildDistanceCell(line, total),
					],
					[
						buildTulipCell(line),
						{},
						{
							stack: [
								{ text: 'Road No.', style: 'cellLabel' },
								{ text: line.roadNo || '', fontSize: 8.5 },
							],
						},
						{ ...parseHtml(line.note), colSpan: 3 },
						{},
						{},
					],
				],
			},
			layout: lineBlockLayout,
			margin: [0, 0, 0, 0],
		}));

		const docDefinition = {
			content: [
				{ text: 'Roadbook', style: 'title' },
				...lineBlocks,
			],
			styles: {
				title: { fontSize: 18, bold: true, marginBottom: 12 },
				kmTotal: { fontSize: 13, bold: true },
				cellLabel: { fontSize: 6.5, color: '#666666' },
			},
			defaultStyle: { fontSize: 10 },
		};

		pdfMake.createPdf(docDefinition).download(tripFileName(tripName) + '.pdf');
	};

	return { downloadTCRPdf, downloadPdf };
};
