import jwt from 'jsonwebtoken';
import axios from 'axios';
import 'dotenv/config';

async function testRequest() {
    try {
        const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_123456789';
        const token = jwt.sign({ id: 3, role: 'user', email: 'student@elearning.com' }, secret, {
            expiresIn: '24h',
        });

        console.log('Using token:', token);
        console.log('Sending request to http://localhost:8089/api/payment/momo/create...');

        const response = await axios.post('http://localhost:8089/api/payment/momo/create', {
            courseIds: [1]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Headers:', error.response?.headers);
        console.error('Error Data:', error.response?.data || error.message);
    }
}

testRequest();
