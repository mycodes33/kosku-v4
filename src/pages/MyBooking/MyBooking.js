import {useState, useEffect} from 'react'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './MyBooking.module.css'

import {checkStatus} from 'utils/Booking'
import Navbar from 'components/Navbar/Navbar'
import BookingItem from 'components/BookingItem/BookingItem'
import Loader from 'components/Loader/Loader'

export default function MyBooking() {
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
        useDb.collection('bookings').where('customer', '==', auth.id).get().then(res => {
            setBookings(res.docs.map(doc => doc.data()))
            setResults(res.docs.map(doc => doc.data()).filter(item => item.status === 'waiting'))
            setLoading(false)
            checkStatus(res.docs.map(doc => doc.data()))
        })
    }, [auth.id])

    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <h3>Pesananmu</h3>
                <div className={styles.menu}>
                    <button className={selected === 'waiting' ? styles.selected : null} onClick={() => setList('waiting')}>Menunggu Konfirmasi</button>
                    <button className={selected === 'confirmed' ? styles.selected : null} onClick={() => setList('confirmed')}>Menunggu Pembayaran</button>
                    <button className={selected === 'all' ? styles.selected : null} onClick={() => setList('all')}>Semua</button>
                </div>
                <div>
                    {results?.map((booking, i) => (
                        <BookingItem booking={booking} key={i}/>
                    ))}
                </div>
            </div>
            {loading && <Loader/>}
        </>
    )
}