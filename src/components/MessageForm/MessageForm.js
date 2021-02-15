import {useState, useRef} from 'react'
import {useParams} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import {v4 as uuidv4} from 'uuid'
import styles from './MessageForm.module.css'

import {Send} from 'Icons'

export default function MessageForm() {
    const {auth} = useAuthContext()
    const [text, setText] = useState('')
    const inputRef = useRef()
    let params = useParams()

    function changeText(e) {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
        setText(e.target.value)
    }

    function sendMessage() {
        const data = {
            id: uuidv4(),
            text,
            images: [],
            room: null,
            read: false,
            deleteFor: null,
            sender: auth.id,
            sendTime: new Date()
        }

        useDb.collection('chats').doc(params.id).collection('messages').doc(data.id).set(data)
        setText('')
        inputRef.current.style.height = 'auto'
    }

    return (
        <div className={styles.form}>
            <textarea placeholder="Tulis pesan..." spellCheck={false} rows={1} ref={inputRef} value={text} onChange={changeText}/>
            <i onClick={sendMessage}><Send/></i>
        </div>
    )
}