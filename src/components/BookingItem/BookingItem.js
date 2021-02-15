import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useDb} from 'services/Api'
import styles from './BookingItem.module.css'

import Time from 'utils/Time'
import {Location} from 'Icons'

export default function BookingItem({booking}) {
    const [room, setRoom] = useState()
    const [user, setUser] = useState()
    let history = useHistory()

    useEffect(() => {
        useDb.collection('rooms').doc(booking.room).get().then(res => {
            setRoom(res.data())
        })
        useDb.collection('users').doc(booking.customer).get().then(res => {
            setUser(res.data())
        })
    }, [booking.room, booking.customer])

    return (
        <div className={styles.item} onClick={() => history.push(`/booking/${booking.id}`)}>
            <div className={styles.info}>
                {booking.status === 'waiting' && <p className={styles.waiting}>Menunggu Konfirmasi</p>}
                {booking.status === 'confirmed' && <p className={styles.confirmed}>Menunggu Pembayaran</p>}
                {booking.status === 'finished' && <p className={styles.confirmed}>Selesai</p>}
                {booking.status === 'canceled' && <p className={styles.canceled}>Dibatalkan</p>}

                {booking.status === 'waiting' && <span>{Time(booking.bookingTime).remaining(172800)}</span>}
            </div>
            <div className={styles.room}>
                <img src={room?.images[0]} alt=""/>
                <div>
                    <h4>{room?.name}</h4>
                    <div className={styles.location}>
                        <Location/>
                        <div>
                            <span>{room?.location.city}</span>
                            <p>{room?.location.address}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.detail}>
                <div>
                    <p>Total pesanan:</p>
                    <span>Rp. {booking.paymentTotal.toLocaleString('id-ID')}</span>
                </div>
                <div>
                    <p>Pemesan:</p>
                    <span>{user?.username}</span>
                </div>
            </div>
        </div>
    )
}