import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import styles from './NavbarHome.module.css'

import {Close, Menu} from 'Icons'
import Sidebar from 'components/Sidebar/Sidebar'

export default function NavbarHome() {
    const {auth} = useAuthContext()
    const [greating, setGreating] = useState()
    const [open, setOpen] = useState(false)
    let history = useHistory()

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour > 0 && hour < 11) setGreating('pagi')
        else if (hour < 14) setGreating('siang')
        else if (hour < 18) setGreating('sore')
        else setGreating('malam')
    }, [])

    return (
        <>
            <nav className={styles.navbar}>
                {auth ? <div>
                    <img src={auth.profilePhoto ?? "https://placeimg.com/100/100/people"} alt="" onClick={() => history.push('/profile')}/>
                    <div>
                        <p>Selamat {greating},</p>
                        <h4>{auth.username}</h4>
                    </div>
                </div> :
                    <h4 className={styles.guest}>Selamat {greating}</h4>
                }
                <i onClick={() => setOpen(!open)}>{open ? <Close/> : <Menu/>}</i>
            </nav>
            {open && <Sidebar onClose={() => setOpen(false)}/>}
        </>
    )
}