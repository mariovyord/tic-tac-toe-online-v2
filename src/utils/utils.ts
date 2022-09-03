import { Timestamp } from "firebase/firestore";

export const toTitleCase = (str: string) => {
	return str.replace(
		/\w\S*/g,
		function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}

export const spaceToDashAndLowerCase = (str: string) => {
	return str
		.trim()
		.replace(
			/\s+/g,
			function (txt) {
				return '-';
			}
		)
		.toLowerCase();
}

export const firebaseDateToString = (date: Timestamp) => {
	return date.toDate().toISOString();
}