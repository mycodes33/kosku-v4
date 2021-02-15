import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuth, useDb} from 'services/Api'
import styles from './Register.module.css'

import {validateEmail, validatePassword, validateUsername} from 'utils/Validation'
import TextInput from 'components/TextInput/TextInput'
import Select from 'components/Select/Select'
import AuthOption from 'components/AuthOption/AuthOption'
import Button from 'components/Button/Button'
import Loader from 'components/Loader/Loader'

export default function Register() {
    const [username, setUsername] = useState()
    const [phone, setPhone] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [type, setType] = useState('owner')
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false)
    let history = useHistory()

    function handleRegister() {
        if (username && email && password) {
            setLoading(true)
            useAuth.createUserWithEmailAndPassword(email, password).then(res => {
                const data = {
                    username, phone, email, password,
                    emailVerified: false,
                    id: res.user.uid,
                    isOnline: false,
                    profilePhoto: null,
                    roomFavorites: [],
                    registerTime: new Date(),
                    lastLoginnTime: new Date(),
                    userType: type
                }

                useDb.collection('users').doc(data.id).set(data).then(() => {
                    history.push('/verification', true)
                })
            }).catch(err => {
                setLoading(false)
                setMessage(err.message)
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.auth}>
                <h1>Daftar</h1>
                <label>Nama Lengkap</label>
                <TextInput validation={validateUsername} onChange={setUsername}/>
                <label>No.Telepon</label>
                <TextInput type="number" onChange={setPhone}/>
                <label>Email Address</label>
                <TextInput type="email" validation={validateEmail} onChange={setEmail}/>
                <label>Password</label>
                <TextInput type="password" validation={validatePassword} onChange={setPassword}/>
                <label>Daftar sebagai</label>
                <Select onChange={setType}>
                    <option value="owner">Pemilik Kost</option>
                    <option value="customer">Pencari Kost</option>
                </Select>
                <p className={styles.error}>{message}</p>

                <Button onClick={!loading && handleRegister}>Daftar</Button>

                <p>Atau masuk dengan</p>
                <AuthOption/>
                <p>Sudah Punya Akun? <b onClick={() => history.replace('/login')}>Masuk Disini</b></p>
            </div>
            {loading && <Loader/>}
        </div>
    )
}