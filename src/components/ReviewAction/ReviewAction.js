import {useState, useEffect} from 'react'
import {useDb} from 'services/Api'
import styles from './ReviewAction.module.css'

import Time from 'utils/Time'
import {Location} from 'Icons'
import Rating from 'components/Rating/Rating'
import Button from 'components/Button/Button'

export default function ReviewItem({room, review}) {
    const [user, setUser] = useState()
    const [message, setMessage] = useState(review.reply?.message ?? '')
    const [open, setOpen] = useState(false)

    function addReply() {
        const data = {
            message,
            sendTime: new Date()
        }
        if (message) {
            useDb.collection('rooms').doc(review.room).collection('reviews').doc(review.id).set({reply: data}, {merge: true}).then(() => {
                setOpen(false)
            })
        }
    }

    useEffect(() => {
        useDb.collection('users').doc(review.sender).get().then(res => {
            setUser(res.data())
        })
    }, [review.sender])

    return (
        <div className={styles.review}>
            <div className={styles.room}>
                <img src={room?.images[0]} alt=""/>
                <div>
                    <h4>{room?.name}</h4>
                    <div className={styles.location}>
                        <Location/>
                        <div>
                            <span>{room?.location.city}</span>
                            <p>{room?.location.address}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Rating rate={review.rating}/>
            <p className={styles.from}>Oleh <b>{user?.username}</b></p>
            <p className={styles.time}>{Time(review.sendTime).fromNow()}</p>
            <p className={styles.text}>{review.text}</p>
            <button id={styles.replyBtn} onClick={() => setOpen(!open)}>{open ? 'Tutup' : 'Balas'}</button>

            {open && <div className={styles.form}>
                <textarea placeholder="Balasanmu.." value={message} onChange={e => setMessage(e.target.value)}/>
                <Button onClick={addReply}>Kirim</Button>
            </div>}
        </div>
    )
}