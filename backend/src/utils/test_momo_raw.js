import crypto from 'crypto';
import axios from 'axios';
import 'dotenv/config';

const partnerCode = 'MOMOBKUN20180529';
const accessKey = 'klm05TvNBzhg7h7j';
const secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
const apiEndpoint = 'https://test-payment.momo.vn';

async function testMoMo() {
    const orderId = `DH3${Date.now()}`;
    const amount = 349000;
    const orderInfo = `Thanh toan don hang ${orderId} tren UTELearn`;
    const redirectUrl = `http://localhost:3000/order-success?orderId=123`;
    const ipnUrl = `${process.env.BACKEND_PUBLIC_URL}/api/payment/momo/webhook`;
    const extraData = '';
    const requestId = orderId;
    const requestType = 'captureWallet';

    // Tạo signature
    const rawSignature = [
        `accessKey=${accessKey}`,
        `amount=${amount}`,
        `extraData=${extraData}`,
        `ipnUrl=${ipnUrl}`,
        `orderId=${orderId}`,
        `orderInfo=${orderInfo}`,
        `partnerCode=${partnerCode}`,
        `redirectUrl=${redirectUrl}`,
        `requestId=${requestId}`,
        `requestType=${requestType}`,
    ].join('&');

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode,
        partnerName: 'UTELearn',
        storeId: 'UTELearnStore',
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang: 'vi',
        requestType,
        autoCapture: true,
        extraData,
        signature,
    };

    console.log('Sending body:', JSON.stringify(requestBody, null, 2));

    try {
        const response = await axios.post(`${apiEndpoint}/v2/gateway/api/create`, requestBody, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        console.log('Response Success:', response.data);
    } catch (error) {
        console.error('MoMo Error Status:', error.response?.status);
        console.error('MoMo Error Headers:', error.response?.headers);
        console.error('MoMo Error Data:', error.response?.data);
    }
}

testMoMo();
