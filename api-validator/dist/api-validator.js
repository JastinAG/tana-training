"use strict";
// Create three test users: one with notifications enabled, one with notifications disabled, and one without settings
const userWithNotifications = {
    id: 1,
    username: 'alice',
    settings: {
        notifications: true,
    },
};
const userWithoutNotifications = {
    id: 2,
    username: 'bob',
    settings: {
        notifications: false,
    },
};
const userWithoutSettings = {
    id: 3,
    username: 'charlie',
};
function isNotified(user) {
    var _a, _b;
    return (_b = (_a = user.settings) === null || _a === void 0 ? void 0 : _a.notifications) !== null && _b !== void 0 ? _b : false;
}
console.log('test');
console.log('Status for userWithNotifications', isNotified(userWithNotifications)); // true
console.log('Status for userWithoutNotifications', isNotified(userWithoutNotifications)); // false
console.log('Status for userWithoutSettings', isNotified(userWithoutSettings)); // false
//# sourceMappingURL=api-validator.js.map