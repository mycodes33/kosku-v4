import {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useFormContext} from 'contexts/RoomFormContext'
import {useDb} from 'services/Api'
import styles from './EditRoom.module.css'

import Navbar from 'components/Navbar/Navbar'
import RoomForm from 'components/RoomForm/RoomForm'
import Button from 'components/Button/Button'
import Loader from 'components/Loader/Loader'

export default function EditRoom() {
    const {form, dispatch} = useFormContext()
    const [loading, setLoading] = useState(true)
    let history = useHistory()
    let params = useParams()

    function editKost() {
        setLoading(true)
        const data = {...form, lastUpdate: new Date()}
        useDb.collection('rooms').doc(form.id).set(data, {merge: true}).then(() => {
            history.replace('/rooms')
        })
    }

    useEffect(() => {
        useDb.collection('rooms').doc(params.id).get().then(res => {
            dispatch({type: 'SET_ALL', payload: res.data()})
            setLoading(false)
        })
    }, [params.id, dispatch])

    return (
        <>
            <Navbar/>
            {form.name && <div className={styles.edit}>
                <RoomForm/>
                <Button onClick={!loading && editKost}>Edit</Button>
            </div>}
            {loading && <Loader/>}
        </>
    )
}