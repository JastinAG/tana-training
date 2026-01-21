interface UserProfile {
	id: number;
	username: string;
	settings?: {
		notifications?: boolean;
	};
}

// Create three test users: one with notifications enabled, one with notifications disabled, and one without settings
const userWithNotifications: UserProfile = {
	id: 1,
	username: 'alice',
	settings: {
		notifications: true,
	},
};
const userWithoutNotifications: UserProfile = {
	id: 2,
	username: 'bob',
	settings: {
		notifications: false,
	},
};

const userWithoutSettings: UserProfile = {
	id: 3,
	username: 'charlie',
};

function isNotified(user: UserProfile): boolean {
	return user.settings?.notifications ?? false;
}
console.log('test');
console.log('Status for userWithNotifications', isNotified(userWithNotifications)); // true
console.log('Status for userWithoutNotifications', isNotified(userWithoutNotifications)); // false
console.log('Status for userWithoutSettings', isNotified(userWithoutSettings)); // false
