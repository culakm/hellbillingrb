import { pdfFilePrefix } from "@/config/settings";

export function tripFileName(name) {
	if (!name) return "trip";
	return pdfFilePrefix + name.replace(/ /g, "-").toLowerCase();
}
