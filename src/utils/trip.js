export function tripFileName(name) {
	if (!name) return "trip";
	return "roadbook-" + name.replace(/ /g, "-").toLowerCase();
}
