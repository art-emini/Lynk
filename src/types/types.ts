namespace Types {
	export interface User {
		id: string;
		email: string;
		password: string;
		token: string;
		lastLogin: number;
	}

	export interface UserStripped {
		email: string;
		password: string;
	}

	export interface Day {
		date: string;
		visits: number;
		sources: string[];
		parentURL: string;
		parentRedirect: string;
	}

	export interface Lynk {
		ownerID: string;
		id: string;
		redirectUrl: string;
		url: string;
		meta: {
			dateCreated: string;
			visits: number;
			sources: string[];
			dayStats: Day[];
		};
	}
}

export default Types;
