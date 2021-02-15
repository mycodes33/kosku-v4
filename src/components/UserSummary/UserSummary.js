import {useHistory} from 'react-router-dom'

import styles from './UserSummary.module.css'

export default function UserSummary({user}) {
    let history = useHistory()

    return (
        <div className={styles.user}>
            <img src={user.profilePhoto ?? "https://placeimg.com/100/100/people"} alt=""/>
            <div>
                <h4 onClick={() => history.push(`/user/${user.id}`)}>{user.username}</h4>
                <p>{user.userType === 'owner' ? 'Pemilik kost' : 'Penyewa kost'}</p>
            </div>
        </div>
    )
}