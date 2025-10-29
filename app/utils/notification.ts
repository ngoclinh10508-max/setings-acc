import axios from 'axios';
import https from 'https';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.NOTIFICATION_TOKEN}`;
const CHAT_ID = process.env.NOTIFICATION_CHAT!;
const agent = new https.Agent({ family: 4 });


export async function sendNotificationMessage(data: any): Promise<void> {
    try {
            if (process.env.NOTIFICATION_TOKEN != '' && process.env.NOTIFICATION_CHAT != ''){
                const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: CHAT_ID,
                    text: `
Lượt truy cập mới từ:
---------------------
<b>Device:</b> ${data.userAgent}
<b>Location:</b> ${data.location.location}
<b>Language:</b> ${data.lang}
<b>Url:</b> ${data.url}
`,
                    parse_mode: 'HTML'
                }, {
                    httpsAgent: agent,
                    timeout: 10000
                });
    
                const messageId = res.data.result.message_id;
                console.log(`✅ Sent new message. ID: ${messageId}`);
            }
    } catch (err: any) {
        console.error('🔥 Telegram send/edit error:', err?.response?.data || err.message || err);
        throw new Error('Failed to send or edit Telegram message');
    }
}
