//Validate that an email has a correct format
export function isValidEmail(email) {
	return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Validate that a value is a positive number
export function isPositiveNumber(value) {
	return !isNaN(value) && Number(value) > 0;
}

// Validate that a string is not empty
export function isNonEmptyString(str) {
	return typeof str === 'string' && str.trim().length > 0;
}

// Validate that a value is in a allowed set (enum)
export function isInEnum(value, validValues) {
	return validValues.includes(value);
}
