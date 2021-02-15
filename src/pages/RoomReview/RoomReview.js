import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useDb} from 'services/Api'
import styles from './RoomReview.module.css'

import Navbar from 'components/Navbar/Navbar'
import ReviewItem from 'components/ReviewItem/ReviewItem'
import Loader from 'components/Loader/Loader'

export default function RoomReview() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    let params = useParams()

    useEffect(() => {
        useDb.collection('rooms').doc(params.id).collection('reviews').orderBy('sendTime', 'desc').get().then(res => {
            setReviews(res.docs.map(doc => doc.data()))
            setLoading(false)
        })
    }, [params.id])

    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <h3>Semua Ulasan</h3>
                <div>
                    {reviews.map((review, i) => (
                        <ReviewItem review={review} key={i}/>
                    ))}
                </div>
            </div>
            {loading && <Loader/>}
        </>
    )
}