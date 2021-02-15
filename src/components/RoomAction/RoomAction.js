import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {v4 as uuidv4} from 'uuid'
import styles from './RoomAction.module.css'

import Button from 'components/Button/Button'

export default function RoomAction({room}) {
    const {auth} = useAuthContext()
    let history = useHistory()

    function goBooking() {
        const id = uuidv4()
        history.push(`/booking/${id}/new`, {room: room.id})
    }

    return (
        <div className={styles.action}>
            <div className={styles.price}>
                <p>Rp. {room.pricing.price.toLocaleString('id-ID')}/{room.pricing.type}</p>
                {room.availableRooms === 0 && <span>Tidak tersedia</span>}
            </div>
            <Button disabled={!auth || auth.userType === 'owner' || room.availableRooms === 0} onClick={goBooking}>Pesan Sekarang</Button>
        </div>
    )
}