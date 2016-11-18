import cookie from 'react-cookie';

class Cookies {
    constructor() {
        this.token = cookie.load('token');
    }
}

const cookies = new Cookies;
export default cookies;
