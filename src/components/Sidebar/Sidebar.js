import {useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useAuth} from 'services/Api'
import styles from './Sidebar.module.css'

import {Booking, ChatFill, ChevronRight, Dashboard, Login, Logout, Register, Settings, Star} from 'Icons'

export default function Sidebar(props) {
    const {auth} = useAuthContext()
    let history = useHistory()

    function logout() {
        useAuth.signOut()
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => document.body.removeAttribute('style')
    }, [])

    return (
        <>
            <div className={styles.overlay} onClick={() => props.onClose()}/>
            <div className={styles.sidebar}>
                {auth &&
                <div className={styles.profile}>
                    <img src={auth.profilePhoto ?? "https://placeimg.com/100/100/people"} alt="" onClick={() => history.push('/profile')}/>
                    <h3>{auth.username}</h3>
                    <p className={styles.status}>{auth.userType === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}</p>
                </div>}

                {auth?.userType === 'owner' &&
                <div className={styles.menu}>
                    <li onClick={() => history.push('/dashboard')}><Dashboard/>Dashboard</li>
                    <li onClick={() => history.push('/chats')}><ChatFill/>Diskusi</li>
                    <li onClick={() => history.push('/reviews')}><Star/>Reviews</li>
                    <li onClick={() => history.push('/settings')}><Settings/>Settings</li>
                    <li onClick={logout}><Logout/>Keluar</li>
                </div>}

                {auth?.userType === 'customer' &&
                <div className={styles.menu}>
                    <li onClick={() => history.push('/chats')}><ChatFill/>Diskusi</li>
                    <li onClick={() => history.push('/my-booking')}><Booking/>Pesanan</li>
                    <li onClick={() => history.push('/favorites')}><Star/>Favorites</li>
                    <li onClick={() => history.push('/settings')}><Settings/>Settings</li>
                    <li onClick={logout}><Logout/>Keluar</li>
                </div>}

                {!auth &&
                <div className={styles.menu}>
                    <li onClick={() => history.push('/login')}><Login/>Masuk</li>
                    <li onClick={() => history.push('/register')}><Register/>Daftar</li>
                </div>}
                <div className={styles.other}>
                    <li>Artikel<ChevronRight/></li>
                    <li>Bantuan<ChevronRight/></li>
                    <li>Syarat & Ketentuan<ChevronRight/></li>
                </div>
            </div>
        </>
    )
}