import dotenv from 'dotenv';
import { server } from './src/views';

// @ts-ignore
const PORT: string | undefined = dotenv.config().parsed['PORT'];
if (PORT) {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
else {
    console.log('Error while reading .env occurred');
    console.log('.env should contain the number of a port in the format PORT={number}')
}
