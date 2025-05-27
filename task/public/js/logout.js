function logout() {
    sessionStorage.clear();
    localStorage.clear();

    window.location.href = '/';
}