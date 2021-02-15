import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './BookingAction.module.css'

import Button from 'components/Button/Button'

export default function BookingAction({booking, room, update, setLoading}) {
    const {auth} = useAuthContext()
    let history = useHistory()

    function confirm() {
        setLoading()
        useDb.collection('rooms').doc(booking.room).set({availableRooms: room.availableRooms - booking.roomCount}, {merge: true}).then(() => {
            useDb.collection('bookings').doc(booking.id).set({status: 'confirmed', confirmedTime: new Date()}, {merge: true}).then(() => update())
        })
    }

    function cancel() {
        setLoading()
        useDb.collection('bookings').doc(booking.id).set({status: 'canceled', canceledTime: new Date()}, {merge: true}).then(() => update())
    }

    function finish() {
        setLoading()
        useDb.collection('bookings').doc(booking.id).set({status: 'finished', finishedTime: new Date()}, {merge: true}).then(() => update())
    }

    function goChat() {
        setLoading()
        const id = booking.owner + booking.customer
        const data = {
            id,
            creationTime: new Date(),
            users: [booking.owner, booking.customer]
        }

        useDb.collection('chats').doc(id).get().then(res => {
            if (res.exists) {
                history.push(`/chat/${id}`)
            } else {
                useDb.collection('chats').doc(id).set(data).then(() => {
                    history.push(`/chat/${id}`)
                })
            }
        })
    }

    return (
        <div className={styles.action}>
            {auth.userType === 'owner' && room.availableRooms < booking.roomCount && booking.status === 'waiting' &&
                <p>Pesanan ini tidak dapat diproses karena ruangan yang tersedia tidak mencukupi</p>
            }
            {auth.userType === 'owner' && booking.status === 'waiting' && room.availableRooms >= booking.roomCount &&
                <Button onClick={confirm}>Konfirmsi Pesanan</Button>
            }
            {booking.status === 'waiting' &&
                <Button id={styles.cancel} onClick={cancel}>Batalkan Pesanan</Button>
            }
            {auth.userType === 'owner' && booking.status === 'confirmed' &&
                <Button onClick={finish}>Selesai</Button>
            }
            {auth.userType === 'customer' && booking.status === 'finished' &&
                <Button onClick={() => history.push(`/room/${booking.room}/my-review`)}>Berikan Ulasan</Button>
            }
            <Button id={styles.chat} onClick={goChat}>Hubungi {auth.userType === 'owner' ? 'Pemesan' : 'Pemilik'}</Button>
        </div>
    )
}