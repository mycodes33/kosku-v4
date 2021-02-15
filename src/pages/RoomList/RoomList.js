import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useFormContext} from 'contexts/RoomFormContext'
import {useDb} from 'services/Api'
import styles from './RoomList.module.css'

import Navbar from 'components/Navbar/Navbar'
import Button from 'components/Button/Button'
import RoomItem from 'components/RoomItem/RoomItem'
import Loader from 'components/Loader/Loader'

export default function RoomList() {
    const {auth} = useAuthContext()
    const form = useFormContext()
    const [rooms, setRooms] = useState([])
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    let history = useHistory()

    function onSearch(e) {
        const data = rooms.filter(room => room.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setResults(data)
    }

    useEffect(() => {
        form.dispatch({type: 'SET_DEFAULT'})
        useDb.collection('rooms').where('owner', '==', auth.id).orderBy('creationTime', 'desc').get().then(res => {
            setRooms(res.docs.map(doc => doc.data()))
            setResults(res.docs.map(doc => doc.data()))
            setLoading(false)
        })
    }, [auth.id, form])

    return (
        <>
            <Navbar/>
            <div className={styles.my}>
                <Button onClick={() => history.push('/add-room')}>Tambah</Button>
                <div className={styles.search}>
                    <input placeholder="Search.." spellCheck={false} onChange={onSearch}/>
                </div>
                <div>
                    {results.map((room, i) => (
                        <RoomItem key={i} room={room}/>
                    ))}
                </div>
            </div>
            {loading && <Loader/>}
        </>
    )
}