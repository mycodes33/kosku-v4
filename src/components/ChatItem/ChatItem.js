import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './ChatItem.module.css'

export default function ChatItem({chat}) {
    const {auth} = useAuthContext()
    const [user, setUser] = useState()
    const [lastMessage, setLastMessage] = useState()
    let history = useHistory()

    useEffect(() => {
        const id = chat.users.find(id => id !== auth.id)
        useDb.collection('users').doc(id).get().then(res => {
            setUser(res.data())
        })

        const getMessage = useDb.collection('chats').doc(chat.id).collection('messages').onSnapshot(res => {
            const result = res.docs[res.size -1]?.data()
            if (result.deleteFor !== auth.id) {
                setLastMessage(result)
            }
        })

        return () => getMessage()
    }, [auth, chat.users, chat.id])

    return (
        <>
            {lastMessage && <div className={styles.item} onClick={() => history.push(`/chat/${chat.id}`)}>
                <img src="https://placeimg.com/100/100/people" alt=""/>
                <div>
                    <h4>{user?.username}</h4>
                    <span>{lastMessage?.sendTime.toDate().toString().substr(15, 6)}</span>

                    {lastMessage?.sender !== auth.id && lastMessage?.read === false ?
                    <b>{lastMessage?.text}</b> : <p>{lastMessage?.text}</p>}
                </div>
            </div>}
        </>
    )
}