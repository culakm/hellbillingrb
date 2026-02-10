export function decimalToDMS(decimal, isLatitude = true, precision = 1) {
	if (decimal === null || decimal === undefined || decimal === "") return null;
	if (typeof decimal === "string") {
		decimal = parseFloat(decimal);
	}
	if (typeof decimal !== "number" || isNaN(decimal)) return null;

	const sign = decimal < 0 ? -1 : 1;
	const absDeg = Math.abs(decimal);
	const degrees = Math.floor(absDeg);
	const minutesFloat = (absDeg - degrees) * 60;
	const minutes = Math.floor(minutesFloat);
	const seconds = ((minutesFloat - minutes) * 60).toFixed(precision);

	const minPadded = minutes.toString().padStart(2, "0");
	const secPadded = seconds.padStart(3 + precision, "0"); // 03.2 pre precision=1

	const direction = isLatitude ? (sign > 0 ? "N" : "S") : sign > 0 ? "E" : "W";

	return `${degrees}° ${minPadded}' ${secPadded}" ${direction}`;
}

export function DMSToDecimal(dms) {
	if (typeof dms !== "string" && typeof dms !== "number") return null;

	const str = String(dms).trim().toUpperCase();

	// Smer
	let sign = 1;
	if (str.includes("S") || str.includes("W")) sign = -1;

	// Extrahuj **všetky čísla** z reťazca (ignoruj symboly)
	const numbers = str.match(/\d+\.?\d*/g) || [];

	if (numbers.length === 3) {
		// DMS: stupne, minúty, sekundy
		const [degStr, minStr, secStr] = numbers;
		const degrees = parseFloat(degStr);
		const minutes = parseFloat(minStr);
		const seconds = parseFloat(secStr);
		const result = sign * (degrees + minutes / 60 + seconds / 3600);
		return parseFloat(result.toFixed(6));
	}

	// Decimal (1 číslo)
	if (numbers.length === 1) {
		const result = sign * parseFloat(numbers[0]);
		return parseFloat(result.toFixed(6));
	}

	return null;
}
