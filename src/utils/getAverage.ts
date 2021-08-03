export default function getAverage(array: number[], fixed?: number): number {
	let total = 0;

	for (let i = 0; i < array.length; i++) {
		total += array[i];
	}

	return fixed
		? Number((total / array.length).toFixed(fixed))
		: total / array.length;
}
