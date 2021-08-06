export default function dateDiff(date1: Date, date2: Date) {
	const diffTime = Math.abs(Number(date2) - Number(date1));
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
}
