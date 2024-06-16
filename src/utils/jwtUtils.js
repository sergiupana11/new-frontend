import Swal2 from "sweetalert2";

export function notifyUserSessionExpired(navigate) {
    Swal2.fire({
        title: 'Session expired',
        text: 'Please sign in again',
        icon: 'warning'
    }).then(() => {
        navigate('/sign-in')
    })
}