import cookie from 'react-cookie';

class Cookies {
    constructor() {
        this.token = cookie.load('token');
        this.leader_id = cookie.load('leader_id');
        this.parent_id = cookie.load('parent_id');
        this.host = 'http://localhost:8080';
        this.section = (cookie.load('section') || '');
        this.group = cookie.load('group');
        this.member = (cookie.load('member') || '');
        this.admin = (cookie.load('admin') || 0);
    }
}

const cookies = new Cookies;
export default cookies;
