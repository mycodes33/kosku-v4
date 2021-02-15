import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './MyReview.module.css'

import {Star} from 'Icons'
import Navbar from 'components/Navbar/Navbar'
import RoomSummary from 'components/RoomSummary/RoomSummary'
import Button from 'components/Button/Button'
import Loader from 'components/Loader/Loader'

export default function MyReview() {
    const {auth} = useAuthContext()
    const [room, setRoom] = useState()
    const [rating, setRating] = useState()
    const [text, setText] = useState()
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(true)
    let params = useParams()

    function setReview() {
        setLoading(true)
        let data

        if (isEdit) {
            data = {
                rating, text,
                id: params.id + auth.id
            }
        } else {
            data = {
                rating, text,
                id: params.id + auth.id,
                room: params.id,
                images: [],
                reply: null,
                sendTime: new Date(),
                sender: auth.id
            }
        }

        useDb.collection('rooms').doc(params.id).collection('reviews').doc(data.id).set(data, {merge: true}).then(() => {
            setIsEdit(true)
            setLoading(false)
        })
    }

    useEffect(() => {
        useDb.collection('rooms').doc(params.id).get().then(res => {
            setRoom(res.data())
        })
        useDb.collection('rooms').doc(params.id).collection('reviews').doc(params.id + auth.id).get().then(res => {
            setRating(res.data()?.rating ?? 0)
            setText(res.data()?.text ?? '')
            setIsEdit(res.exists)
            setLoading(false)
        })
    }, [params.id, auth.id])

    return (
        <>
            <Navbar/>
            {room && <div className={styles.container}>
                <RoomSummary room={room}/>
                <div className={styles.rating}>
                    {[1,2,3,4,5].map(i => (
                        <i className={i <= rating ? styles.marked : null} key={i} onClick={() => setRating(i)}><Star/></i>
                    ))}
                </div>
                <div className={styles.form}>
                    <label>Ceritakan pengalamanmu?</label>
                    <textarea placeholder="Ayo ceritakan pengalamanmu.." rows="4" value={text} onChange={e => setText(e.target.value)}/>
                    <Button onClick={setReview}>Save</Button>
                </div>
            </div>}
            {loading && <Loader/>}
        </>
    )
}