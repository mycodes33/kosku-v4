import {useState, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './NewBooking.module.css'

import Navbar from 'components/Navbar/Navbar'
import RoomSummary from 'components/RoomSummary/RoomSummary'
import Button from 'components/Button/Button'
import Loader from 'components/Loader/Loader'

export default function NewBooking() {
    const {auth} = useAuthContext()
    const [room, setRoom] = useState()
    const [roomCount, setRoomCount] = useState(1)
    const [timeCount, setTimeCount] = useState(1)
    const [loading, setLoading] = useState(true)
    let history = useHistory()
    let params = useParams()
    let location = useLocation()

    function goBooking() {
        setLoading(true)
        const data = {
            id: params.id,
            room: room.id,
            owner: room.owner,
            customer: auth.id,
            bookingCode: params.id.substr(0,18),
            status: 'waiting',
            bookingTime: new Date(),
            confirmedTime: null,
            finishedTime: null,
            canceledTime: null,
            bookingType: room.pricing.type,
            roomCount,
            timeCount,
            paymentType: 'direct_pay',
            paymentTotal: room.pricing.price * roomCount * timeCount
        }
        useDb.collection('bookings').doc(data.id).set(data).then(() => {
            history.push(`/booking/${data.id}/finish`)
        })
    }

    useEffect(() => {
        useDb.collection('rooms').doc(location.state.room).get().then(res => {
            setRoom(res.data())
            setLoading(false)
        })
    }, [location.state.room])

    return (
        <>
            <Navbar/>
            {room && <div className={styles.container}>
                <h3>Lanjutkan Pemesanan</h3>
                <RoomSummary room={room}/>
                <h4>Harga</h4>
                <p className={styles.price}>Rp. {room.pricing.price.toLocaleString('id-ID')}/{room.pricing.type}</p>

                <div className={styles.detail}>
                    <div>
                        <button disabled={roomCount === 1} onClick={() => setRoomCount(roomCount - 1)}>-</button>
                        <span>{roomCount}</span>
                        <button disabled={roomCount === room.availableRooms} onClick={() => setRoomCount(roomCount + 1)}>+</button>
                        <p>Pesan {roomCount} kamar</p>
                    </div>
                    <div>
                        <button disabled={timeCount === 1} onClick={() => setTimeCount(timeCount - 1)}>-</button>
                        <span>{timeCount}</span>
                        <button disabled={timeCount === 12} onClick={() => setTimeCount(timeCount + 1)}>+</button>
                        <p>Pesan untuk {timeCount} {room.pricing.type}</p>
                    </div>
                </div>

                <h4>Total Bayar</h4>
                <p className={styles.price}>Rp. {(room.pricing.price * roomCount * timeCount).toLocaleString('id-ID')}</p>
                <h4>Metode Pembayaran</h4>
                <div className={styles.payment}>
                    <i/>
                    <p>Bayar Langsung</p>
                </div>
            </div>}
            <div className={styles.action}>
                    <Button onClick={goBooking}>Pesan Sekarang</Button>
                    <p>Dengan melanjutkan, Anda setuju dengan kebijakan kami.</p>
                    <b>Syarat & Kebijakan</b>
                </div>
            {loading && <Loader/>}
        </>
    )
}