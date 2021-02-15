import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useFormContext} from 'contexts/RoomFormContext'
import {useDb} from 'services/Api'
import {v4 as uuidv4} from 'uuid'
import styles from './AddRoom.module.css'

import Navbar from 'components/Navbar/Navbar'
import RoomForm from 'components/RoomForm/RoomForm'
import Button from 'components/Button/Button'
import Loader from 'components/Loader/Loader'

export default function AddRoom() {
    const {auth} = useAuthContext()
    const {form} = useFormContext()
    const [loading, setLoading] = useState(false)
    let history = useHistory()

    function addRoom() {
        setLoading(true)
        const data = {
            ...form,
            id: uuidv4(),
            owner: auth.id,
            creationTime: new Date(),
            lastUpdate: new Date()
        }

        useDb.collection('rooms').doc(data.id).set(data).then(() => {
            history.replace('/rooms')
        })
    }

    return (
        <>
            <Navbar/>
            <div className={styles.add}>
                <RoomForm/>
                <Button onClick={!loading && addRoom}>Tambah</Button>
            </div>

            {loading && <Loader/>}
        </>
    )
}