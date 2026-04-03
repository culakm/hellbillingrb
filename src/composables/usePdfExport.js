import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import { decimalToDMS, tripFileName } from "@/utils";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const parseHtml = (html) => {
	if (!html) return { text: "" };
	const converted = htmlToPdfmake(html, { removeExtraBlanks: true });
	return { text: converted };
};

export const usePdfExport = () => {
	const downloadTCRPdf = (lines, tripName) => {
		const docDefinition = {
			content: [
				{ text: "Lines Report", style: "title" },
				{
					table: {
						headerRows: 1,
						dontBreakRows: true,
						keepWithHeaderRows: 1,
						widths: [20, 70, 70, "*", 20],
						body: [
							[{ text: "No.", style: "tableHeader" }, { text: "Coordinates", style: "tableHeader", colSpan: 2 }, {}, { text: "Note", style: "tableHeader" }, { text: "X", style: "tableHeader" }],
							...lines.map((line) => {
								const note = parseHtml(line.note);
								const hasCoords = line.lat && line.lng;
								const hasCheck = line.stop;
								if (hasCoords && hasCheck) {
									return [{ text: String(line.order), alignment: "center" }, decimalToDMS(line.lat), decimalToDMS(line.lng, false), note, { text: "", alignment: "center" }];
								}
								if (hasCoords && !hasCheck) {
									return [{ text: String(line.order), alignment: "center" }, decimalToDMS(line.lat), decimalToDMS(line.lng, false), { ...note, colSpan: 2 }, {}];
								}
								if (!hasCoords && hasCheck) {
									return [{ text: String(line.order), alignment: "center" }, { ...note, colSpan: 3 }, {}, {}, { text: "", alignment: "center" }];
								}
								return [{ text: String(line.order), alignment: "center" }, { ...note, colSpan: 4 }, {}, {}, {}];
							}),
						],
					},
					layout: "grid",
				},
			],
			styles: {
				title: { fontSize: 18, bold: true, marginBottom: 12 },
				tableHeader: { bold: true, fontSize: 11, color: "#333333" },
			},
			defaultStyle: { fontSize: 10 },
		};

		pdfMake.createPdf(docDefinition).download(tripFileName(tripName) + ".pdf");
	};

	return { downloadTCRPdf };
};
