import { jwtDecode } from 'jwt-decode';

interface UserToken {
    name: string;
    exp: number;
}

class AuthService {
    // Decode and return the user's profile from the JWT token
    getProfile() {
        return jwtDecode(this.getToken() || '');
    }

    // Check if the user is logged in by verifying the existence and validity of the token
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    // Check if the token has expired
    isTokenExpired(token: string) {
        try {
            const decoded = jwtDecode<UserToken>(token);

            if (decoded?.exp < Date.now() / 1000) {
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    }

    // Retrieve the token from local storage
    getToken() {
        return localStorage.getItem('id_token');
    }

    // Save the token to local storage and redirect to the homepage
    login(idToken: string) {
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }

    // Remove the token from local storage and redirect to the homepage
    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
}

export default new AuthService();
