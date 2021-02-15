import {useState, useEffect} from 'react'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './ChatList.module.css'

import Navbar from 'components/Navbar/Navbar'
import ChatItem from 'components/ChatItem/ChatItem'
import Loader from 'components/Loader/Loader'

export default function ChatList() {
    const {auth} = useAuthContext()
    const [chats, setChats] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        useDb.collection('chats').where('users', 'array-contains', auth.id).orderBy('creationTime', 'desc').get().then(res => {
            setChats(res.docs.map(doc => doc.data()))
            setLoading(false)
        })
    }, [auth.id])

    return (
        <>
            <Navbar/>
            <div className={styles.list}>
                {chats.map((chat, i) => (
                    <ChatItem chat={chat} key={i}/>
                ))}
            </div>
            {!loading && chats.length === 0 && <p className={styles.empty}>Kamu belum melakukan percakapan</p>}

            {loading && <Loader/>}
        </>
    )
}