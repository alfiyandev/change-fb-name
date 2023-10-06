export function randomString(length: number = 10): string {
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let text = "";

    for (let i = 0; i < length; i++)
        text += possibleChars.charAt(
            Math.floor(Math.random() * possibleChars.length)
        );

    return text;
}

export function objectToFormData(data: Record<string, any>) {
    const formData = new FormData();

    for (const key of Object.keys(data)) {
        formData.append(key, data[key]);
    }

    return formData;
}

export default {
    randomString,
    objectToFormData
}
