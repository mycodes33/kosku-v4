import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './BookingDetail.module.css'

import Time from 'utils/Time'
import {Copy} from 'Icons'
import Navbar from 'components/Navbar/Navbar'
import RoomSummary from 'components/RoomSummary/RoomSummary'
import UserSummary from 'components/UserSummary/UserSummary'
import BookingStep from 'components/BookingStep/BookingStep'
import BookingAction from 'components/BookingAction/BookingAction'
import Toast from 'components/Toast/Toast'
import Loader from 'components/Loader/Loader'

export default function BookingDetail() {
    const {auth} = useAuthContext()
    const [booking, setBooking] = useState()
    const [room, setRoom] = useState()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    let params = useParams()

    function copyCode() {
        navigator.clipboard.writeText(booking.bookingCode)
    }

    function getBookingData() {
        useDb.collection('bookings').doc(params.id).get().then(res => {
            setBooking(res.data())
            setLoading(false)
        })
    }

    useEffect(() => {
        useDb.collection('bookings').doc(params.id).get().then(res => {
            setBooking(res.data())
            useDb.collection('rooms').doc(res.data().room).get().then(res => {
                setRoom(res.data())
            })
            if (auth.userType === 'owner') {
                useDb.collection('users').doc(res.data().customer).get().then(res => {
                    setUser(res.data())
                    setLoading(false)
                })
            } else {
                useDb.collection('users').doc(res.data().owner).get().then(res => {
                    setUser(res.data())
                    setLoading(false)
                })
            }
        })
    }, [params.id, auth.userType])

    return (
        <>
            <Navbar/>
            {booking && room && user &&
            <div className={styles.container}>
                <h3>Detail Pesanan</h3>
                <RoomSummary room={room}/>
                <div className={styles.detail}>
                    <span>Status:</span>
                    {booking.status === 'waiting' && <p>Menunggu Konfirmasi</p>}
                    {booking.status === 'confirmed' && <p>Menunggu Pembayaran</p>}
                    {booking.status === 'finished' && <p>Selesai</p>}
                    {booking.status === 'canceled' && <p>Dibatalkan</p>}

                    {booking.status === 'waiting' && <>
                        <span className={styles.title}>Sisa Waktu</span>
                        <p>{Time(booking.bookingTime).remaining(172800)}</p>
                    </>}
                    <span>Jumlah Pesanan</span>
                    <p>{booking.roomCount} kamar</p>
                    <span>Total Pembayaran:</span>
                    <p className={styles.price}>Rp. {booking.paymentTotal.toLocaleString('id-ID')}</p>
                    <span>Kode Pesanan:</span>
                    <div className={styles.code}>
                        <p>{booking.bookingCode}</p>
                        <Toast message="Kode berhasil disalin!">
                            <i onClick={copyCode}><Copy/></i>
                        </Toast>
                    </div>
                </div>

                <h4>Riwayat</h4>
                <BookingStep booking={booking}/>

                <h4>{user.userType === 'owner' ? 'Pemilik' : 'Pemesan'}</h4>
                <UserSummary user={user}/>
                <BookingAction booking={booking} room={room} update={getBookingData} setLoading={() => setLoading(!loading)}/>
            </div>}
            {loading && <Loader/>}
        </>
    )
}