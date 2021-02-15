import {useState, useEffect} from 'react'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './Favorites.module.css'

import Navbar from 'components/Navbar/Navbar'
import RoomCard from 'components/RoomCard/RoomCard'
import Loader from 'components/Loader/Loader'

export default function Favorites() {
    const {auth} = useAuthContext()
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        useDb.collection('rooms').get().then(res => {
            const data = res.docs.map(doc => doc.data()).filter(({id}) => auth.roomFavorites.includes(id))
            setRooms(data)
            setLoading(false)
        })
    }, [auth.roomFavorites])

    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <h3>Kost favorite kamu</h3>
                <div className={styles.list}>
                    {rooms.map((room, i) => (
                        <RoomCard room={room} key={i}/>
                    ))}
                </div>
            </div>
            {loading && <Loader/>}
        </>
    )
}