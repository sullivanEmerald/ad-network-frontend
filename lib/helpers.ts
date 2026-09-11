export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const timeFormatRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
export const urlRegex =
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,6})?(\/[\w\d-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
export const validNamePattern = /^[A-Za-z0-9\s]+$/;
export const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;

export const validatePassword = (password: any) => {
    if (!password) {
        return "Password is required";
    }
    if (password.length < 8) {
        return "Your password is not strong enough. Use at least 8 characters";
    }
    if (!/[0-9]/.test(password)) {
        return "Use at least 1 digit";
    }
    if (!/[A-Z]/.test(password)) {
        return "Use at least 1 Uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
        return "Use at least 1 Lowercase letter";
    }
    return "";
};