import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useAuthContext} from 'contexts/AuthContext'
import {useDb} from 'services/Api'
import styles from './Home.module.css'

import {ChevronBottom, ChevronTop} from 'Icons'
import NavbarHome from 'components/NavbarHome/NavbarHome'
import Carousel from 'components/Carousel/Carousel'
import SearchForm from 'components/SearchForm/SearchForm'
import RoomMenu from 'components/RoomMenu/RoomMenu'
import RoomCard from 'components/RoomCard/RoomCard'
import Loader from 'components/Loader/Loader'

import cities from 'source/cities.json'

export default function Home() {
    const {auth} = useAuthContext()
    const [city, setCity] = useState()
    const [promo, setPromo] = useState([])
    const [allRooms, setAllRooms] = useState([])
    const [roomsAround, setRoomsAround] = useState()
    const [citiesOpen, setCitiesOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    let history = useHistory()

    function changeCity(e) {
        setCity(e)
        setRoomsAround(allRooms.filter(room => room.location.city === e))
    }

    function changeType(type) {
        console.log(type)
    }

    useEffect(() => {
        useDb.collection('promo').get().then(res => {
            setPromo(res.docs.map(doc => doc.data()))
        })
        useDb.collection('rooms').get().then(res => {
            const result = res.docs.map(doc => doc.data())
            setAllRooms(result)

            fetch('https://ipapi.co/json').then(res => res.json()).then(res => {
                const myCity = cities.find(item => item === res.city)
                if (myCity) {
                    setCity(myCity)
                    setRoomsAround(result.filter(room => room.location.city === myCity))
                } else {
                    setCity('Bandung')
                    setRoomsAround(result.filter(room => room.location.city === 'Bandung'))
                }
                setLoading(false)
            })
        })
    }, [auth])

    return (
        <>
            <NavbarHome/>
            <div className={styles.promo}>
                <Carousel autoplay>
                    {promo.map(promo => (
                        <img key={promo.id} src={promo.image} alt=""/>
                    ))}
                </Carousel>
            </div>
            <div className={styles.sticky}>
                <div onClick={() => history.push('/search')}><SearchForm/></div>
                <RoomMenu onChange={changeType}/>
            </div>
            <div className={styles.add}>
                <p>Anda Pemilik Kost?</p>
                <button onClick={() => history.push('/add-room')}>Pasang Iklan</button>
            </div>
            <h4 className={styles.title}>Rekomendasi untukmu</h4>
            <div className={styles.list}>
                {allRooms.map(room => (
                    <RoomCard key={room.id} room={room}/>
                ))}
            </div>

            <div className={styles.cities}>
                <h4>Kost daerah</h4>
                <div onClick={() => setCitiesOpen(!citiesOpen)}>
                    <span>{city}</span>
                    <i>{citiesOpen ? <ChevronTop/> : <ChevronBottom/>}</i>

                    {citiesOpen && <div className={styles.cityList}>
                        {cities.map((city, i) => (
                            <p key={i} onClick={() => changeCity(city)}>{city}</p>
                        ))}
                    </div>}
                </div>
            </div>
            {roomsAround?.length === 0 && <p className={styles.empty}>Upps, sepertinya belum ada kost di daerah ini.</p>}
            <div className={styles.list}>
                {roomsAround?.map(room => (
                    <RoomCard key={room.id} room={room}/>
                ))}
            </div>
            {loading && <Loader/>}
        </>
    )
}