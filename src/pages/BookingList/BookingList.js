import {useState, useEffect} from 'react'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './BookingList.module.css'

import {checkStatus} from 'utils/Booking'
import Navbar from 'components/Navbar/Navbar'
import BookingItem from 'components/BookingItem/BookingItem'
import Loader from 'components/Loader/Loader'

export default function BookingList() {
    const {auth} = useAuthContext()
    const [bookings, setBookings] = useState()
    const [results, setResults] = useState()
    const [selected, setSelected] = useState('waiting')
    const [loading, setLoading] = useState(true)

    function setList(status) {
        setSelected(status)
        if (status === 'all') {
            setResults(bookings)
        } else {
            setResults(bookings.filter(booking => booking.status === status))
        }
    }

    useEffect(() => {
        useDb.collection('bookings').where('owner', '==', auth.id).orderBy('bookingTime', 'desc').get().then(res => {
            const result = res.docs.map(doc => doc.data())
            setBookings(result)
            setResults(result.filter(booking => booking.status === 'waiting'))
            setLoading(false)
            checkStatus(result)
        })
    }, [auth.id])

    return (
        <>
            <Navbar/>
            <div className={styles.menu}>
                <button className={selected === 'waiting' ? styles.selected : null} onClick={() => setList('waiting')}>Menunggu Konfirmasi</button>
                <button className={selected === 'confirmed' ? styles.selected : null} onClick={() => setList('confirmed')}>Menunggu Pembayaran</button>
                <button className={selected === 'finished' ? styles.selected : null} onClick={() => setList('finished')}>Selesai</button>
                <button className={selected === 'canceled' ? styles.selected : null} onClick={() => setList('canceled')}>Dibatalkan</button>
                <button className={selected === 'all' ? styles.selected : null} onClick={() => setList('all')}>Semua</button>
            </div>
            <div className={styles.list}>
                {results && results.map((booking, i) => (
                    <BookingItem booking={booking} key={i}/>
                ))}
            </div>
            {loading && <Loader/>}
        </>
    )
}