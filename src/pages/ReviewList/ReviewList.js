import {useState, useEffect} from 'react'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './ReviewList.module.css'

import Navbar from 'components/Navbar/Navbar'
import ReviewAction from 'components/ReviewAction/ReviewAction'
import Loader from 'components/Loader/Loader'

export default function ReviewList() {
    const {auth} = useAuthContext()
    const [rooms, setRooms] = useState([])
    const [reviews, setReviews] = useState([])
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState('new')
    const [loading, setLoading] = useState(true)

    function setList(status) {
        setSelected(status)
        if (status === 'new') {
            setResults(reviews.filter(review => review.reply === null))
        } else {
            setResults(reviews.filter(review => review.reply !== null))
        }
    }

    useEffect(() => {
        useDb.collection('rooms').where('owner', '==', auth.id).get().then(res => {
            setRooms(res.docs.map(doc => doc.data()))
            res.docs.forEach(item => {
                useDb.collection('rooms').doc(item.id).collection('reviews').get().then(res => {
                    const result = res.docs.map(doc => doc.data())
                    setReviews(prev => [...prev, ...result])
                    setResults(prev => [...prev, ...result.filter(item => item.reply === null)])
                    setLoading(false)
                })
            })
        })
    }, [auth.id])

    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <div className={styles.menu}>
                    <button className={selected === 'new' ? styles.selected : null} onClick={() => setList('new')}>Baru</button>
                    <button className={selected === 'old' ? styles.selected : null} onClick={() => setList('old')}>Dibalas</button>
                </div>
                <div>
                    {results.map(review => {
                        const room = rooms.find(room => room.id === review.room)
                        return <ReviewAction key={review.id} room={room} review={review}/>
                    })}
                </div>
            </div>
            {loading && <Loader/>}
        </>
    )
}