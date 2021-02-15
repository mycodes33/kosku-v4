import {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './NavbarDetail.module.css'

import {ChevronLeft, Heart, HeartFill, Share} from 'Icons'

export default function NavbarDetail({name}) {
    const {auth} = useAuthContext()
    const [favorited, setFavorited] = useState(false)
    let history = useHistory()
    let params = useParams()

    function goBack() {
        if (history.action === 'REPLACE') {
            history.go(- (history.length -1))
        } else {
            history.goBack()
        }
    }

    function addFavorite() {
        let data

        if (auth.roomFavorites.find(id => id === params.id)) {
            data = auth.roomFavorites.filter(id => id !== params.id)
            auth.roomFavorites = data
            setFavorited(false)
        } else {
            data = auth.roomFavorites
            data.push(params.id)
            setFavorited(true)
        }

        useDb.collection('users').doc(auth.id).set({roomFavorites: data}, {merge: true})
    }

    function goShare() {
        if (navigator.share) {
            navigator.share({
                title: name,
                url: history.location.pathname
            })
        } else {
            window.open(history.location.pathname, '_blank')
        }
    }

    useEffect(() => {
        auth?.roomFavorites.find(id => id === params.id) && setFavorited(true)
    }, [auth, params.id])

    return (
        <nav className={styles.navbar}>
            <i className={styles.iconBack} onClick={(goBack)}><ChevronLeft/></i>
            <div className={styles.right}>
                {auth?.userType === 'customer' && <i className={styles.iconLike} onClick={addFavorite}>{favorited ? <HeartFill/> : <Heart/>}</i>}
                <i className={styles.iconShare} onClick={goShare}><Share/></i>
            </div>
        </nav>
    )
}