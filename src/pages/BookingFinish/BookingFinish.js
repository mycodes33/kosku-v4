import {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useDb} from 'services/Api'
import styles from './BookingFinish.module.css'

import {Check, Copy} from 'Icons'
import Button from 'components/Button/Button'
import Toast from 'components/Toast/Toast'
import Loader from 'components/Loader/Loader'

export default function BookingFinish() {
    const [booking, setBooking] = useState()
    const [loading, setLoading] = useState(true)
    let history = useHistory()
    let params = useParams()

    function copyCode() {
        navigator.clipboard.writeText(booking.bookingCode)
    }

    useEffect(() => {
        useDb.collection('bookings').doc(params.id).get().then(res => {
            setBooking(res.data())
            setLoading(false)
        })
    }, [params.id])

    return (
        <>
            {booking && <div className={styles.container}>
                <i className={styles.checkIcon}><Check/></i>
                <h4>Pesananmu akan segera diproses oleh pemilik kost</h4>
                <div className={styles.code}>
                    <p>{booking.bookingCode}</p>
                    <Toast message="Kode berhasil disalin!">
                        <i onClick={copyCode}><Copy/></i>
                    </Toast>
                </div>
                <div className={styles.action}>
                    <Button onClick={() => history.replace(`/room/${booking.room}`)}>Selesai</Button>
                </div>
            </div>}
            {loading && <Loader/>}
        </>
    )
}