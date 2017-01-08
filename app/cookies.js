import cookie from 'react-cookie';

class Cookies {
    constructor() {
        this.token = cookie.load('token');
        this.leader_id = cookie.load('leader_id');
        this.host = 'http://localhost:8080';
    }
}

const cookies = new Cookies;
export default cookies;
