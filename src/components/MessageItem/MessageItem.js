import {useAuthContext} from 'contexts/AuthContext'
import styles from './MessageItem.module.css'

export default function MessageItem({message}) {
    const {auth} = useAuthContext()

    return (
        <div className={auth.id === message.sender ? styles.myMessage : styles.otherMessage}>
            <p>{message.text}</p>
            <span>{message.sendTime.toDate().toString().substr(15, 6)}</span>
        </div>
    )
}