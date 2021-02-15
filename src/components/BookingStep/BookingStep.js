import styles from './BookingStep.module.css'

import Time from 'utils/Time'

export default function BookingStep({booking}) {
    return (
        <div>
            <div className={styles.step}>
                <span className={booking.bookingTime ? styles.pass : null}/>
                <h5>Dipesan</h5>
                <p>{Time(booking.bookingTime).toDateTime()}</p>
            </div>

            {booking.status === 'canceled' &&
            <div className={styles.step}>
                <span className={booking.canceledTime ? styles.pass : null}/>
                <h5>Dibatalkan</h5>
                <p>{booking.canceledTime ? Time(booking.canceledTime).toDateTime() : 'Dibatalkan'}</p>
            </div>}

            {booking.status !== 'canceled' && <>
            <div className={styles.step}>
                <span className={booking.confirmedTime ? styles.pass : null}/>
                <h5>Dikonfirmasi</h5>
                <p>{booking.confirmedTime ? Time(booking.confirmedTime).toDateTime() : 'Menunggu konfirmasi'}</p>
            </div>
            <div className={styles.step}>
                <span className={booking.finishedTime ? styles.pass : null}/>
                <h5>Selesai</h5>
                <p>{booking.finishedTime ? Time(booking.finishedTime).toDateTime() : 'Menunggu pembayaran'}</p>
            </div></>}
        </div>
    )
}