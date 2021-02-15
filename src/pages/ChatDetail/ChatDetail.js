import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './ChatDetail.module.css'

import Time from 'utils/Time'
import NavbarChat from 'components/NavbarChat/NavbarChat'
import MessageItem from 'components/MessageItem/MessageItem'
import MessageForm from 'components/MessageForm/MessageForm'
import Loader from 'components/Loader/Loader'

export default function ChatDetail() {
    const {auth} = useAuthContext()
    const [user, setUser] = useState()
    const [messages, setMessages] = useState()
    const [menu, setMenu] = useState(false)
    let params = useParams()
    let date

    function deleteChat() {
        messages.forEach(message => {
            if (message.deleteFor) {
                useDb.collection('chats').doc(params.id).collection('messages').doc(message.id).delete()
            } else {
                useDb.collection('chats').doc(params.id).collection('messages').doc(message.id).set({deleteFor: auth.id}, {merge: true})
            }
        })
        setMenu(false)
    }

    useEffect(() => {
        useDb.collection('chats').doc(params.id).get().then(res => {
            const userId = res.data().users.find(id => id !== auth.id)
            useDb.collection('users').doc(userId).get().then(res => {
                setUser(res.data())
            })
        })
        const getMessage = useDb.collection('chats').doc(params.id).collection('messages').orderBy('sendTime').onSnapshot(res => {
            const data = res.docs.map(doc => doc.data()).filter(message => message.deleteFor !== auth.id)
            setMessages(data)
            data.forEach(message => {
                if (message.sender !== auth.id && message.read === false) {
                    useDb.collection('chats').doc(params.id).collection('messages').doc(message.id).set({read: true}, {merge: true})
                }
            })
        })

        return () => getMessage()
    }, [params.id, auth.id])

    return (
        <>
            <NavbarChat user={user} toggleMenu={() => setMenu(!menu)}/>
            <div className={styles.container} onClick={() => setMenu(false)}>
                {messages ?

                <div>
                    {messages.map((message) => {
                        if (date !== message.sendTime.toDate().toString().substr(8,2)) {
                            date = message.sendTime.toDate().toString().substr(8,2)
                            return (
                                <div key={message.id}>
                                    <p className={styles.date}>{Time(message.sendTime).toDate()}</p>
                                    <MessageItem message={message}/>
                                </div>
                            )
                        }
                        return <MessageItem message={message} key={message.id}/>
                    })}
                </div>

                : <Loader/>}
            </div>
            {menu && <div className={styles.menu}>
                <p>Blokir Pengguna</p>
                <p>Laporkan Pengguna</p>
                <p onClick={deleteChat}>Hapus Percakapan</p>
            </div>}
            <MessageForm/>
        </>
    )
}