import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useDb} from 'services/Api'
import styles from './RoomDetail.module.css'

import NavbarDetail from 'components/NavbarDetail/NavbarDetail'
import Carousel from 'components/Carousel/Carousel'
import RoomDetailMain from 'components/RoomDetailMain/RoomDetailMain'
import RoomFacilities from 'components/RoomFacilities/RoomFacilities'
import UserSummary from 'components/UserSummary/UserSummary'
import RoomDetailReview from 'components/RoomDetailReview/RoomDetailReview'
import RoomAction from 'components/RoomAction/RoomAction'
import Loader from 'components/Loader/Loader'

export default function RoomDetail() {
    const [room, setRoom] = useState()
    const [owner, setOwner] = useState()
    const [rating, setRating] = useState({rate: 0, count: 0})
    const [review, setReview] = useState()
    const [showAll, setShowAll] = useState(false)
    const [loading, setLoading] = useState(true)
    let params = useParams()

    useEffect(() => {
        useDb.collection('rooms').doc(params.id).get().then(res => {
            setRoom(res.data())
            useDb.collection('users').doc(res.data().owner).get().then(res => {
                setOwner(res.data())
                setLoading(false)
            })
        })
        useDb.collection('rooms').doc(params.id).collection('reviews').orderBy('sendTime', 'desc').get().then(res => {
            const result = res.docs.map(doc => doc.data())
            if (result.length) {
                const rate = (result.reduce((a, b) => a + b.rating, 0) / result.length).toFixed(1)
                setRating({rate, count: result.length})

                useDb.collection('users').doc(result[0].sender).get().then(res => {
                    const data = {
                        lastReview: result[0],
                        user: res.data().username,
                        reviewCount: result.length
                    }
                    setReview(data)
                })
            }
        })
    }, [params.id])

    return (
        <>
            <NavbarDetail name={room?.name}/>
            {room && owner && <>
            <div className={styles.images}>
                <Carousel>
                    {room.images.map((img, i) => (
                        <img src={img} alt="" key={i}/>
                    ))}
                </Carousel>
            </div>

            <div className={styles.detail}>
                <RoomDetailMain room={room} rating={rating}/>
                <RoomFacilities facilities={room.facilities}/>

                <div className={styles.description}>
                    <h4>Deskripsi</h4>
                    <p className={showAll ? styles.showAll : null}>{room.description}</p>
                    <span onClick={() => setShowAll(!showAll)}>{showAll ? 'Sembunyikan' : 'Selengkapnya'}</span>
                </div>

                <div className={styles.rules}>
                    <h4>Kebijakan & Aturan tempat tinggal</h4>
                    <p>{room.rules}</p>
                </div>
                <div className={styles.owner}>
                    <UserSummary user={owner}/>
                </div>
                {review && <RoomDetailReview review={review}/>}
            </div>
            <RoomAction room={room}/>
            </>}
            {loading && <Loader/>}
        </>
    )
}