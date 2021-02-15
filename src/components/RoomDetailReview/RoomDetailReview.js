import {useHistory, useParams} from 'react-router-dom'
import styles from './RoomDetailReview.module.css'

import Rating from 'components/Rating/Rating'

export default function RoomDetailReview({review}) {
    let history = useHistory()
    let params = useParams()

    return (
        <div className={styles.review}>
            <h4>Ulasan Penyewa</h4>
            <p className={styles.count}>{review.reviewCount} Ulasan</p>
            <div className={styles.reviewRating}>
                <Rating rate={review.lastReview.rating}/>
                <p>Oleh <b>{review.user}</b></p>
            </div>
            <p className={styles.text}>{review.lastReview.text}</p>
            <button onClick={() => history.push(`/room/${params.id}/reviews`)}>Lihat Semua</button>
        </div>
    )
}