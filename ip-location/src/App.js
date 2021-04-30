import 'leaflet/dist/leaflet.css';
import './App.css';
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { DateTime } from "luxon";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';




function App() {
  const [data, setData] = useState('')
  const [countryData, setCountryData] = useState('')
  const [localTime, setLocalTime] = useState(DateTime.now().c)
  const [londonTime, setLondonTime] = useState('')
  const [yorkTime, setYorkTime] = useState('')


  const transferLondon = () => {
    let event = new Date();
    event = (event.toLocaleString('en-GB', { timeZone: 'Europe/London' }))
    let eventTime = event.split(' ')[1]
    let eventDate = event.split(' ')[0]
    eventTime = eventTime.split(':')
    eventDate = eventDate.split('/')
    setLondonTime({ eventDate, eventTime })
  }
  const transferYork = () => {
    let event = new Date();
    event = (event.toLocaleString('en-GB', { timeZone: 'America/New_York' }))
    let eventTime = event.split(' ')[1]
    let eventDate = event.split(' ')[0]
    eventTime = eventTime.split(':')
    eventDate = eventDate.split('/')
    setYorkTime({ eventDate, eventTime })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(DateTime.now().c)
      transferLondon()
      transferYork()
    }, 1000);
    return () => clearInterval(interval);
  }, [])


  useEffect(() => {
    transferLondon()
    fetchData()
  }, [])

  const APIKEY = process.env.REACT_APP_API_TOKEN

  const fetchData = async () => {
    await Axios.get(`https://geo.ipify.org/api/v1?apiKey=${APIKEY}`)
      .then(response => setData(response.data))
      .catch(error => alert(error))
  }

  useEffect(() => {
    if (data) fetchCountry()
  }, [data])

  const fetchCountry = async () => {
    await Axios.get(`https://restcountries.eu/rest/v2/alpha/${data.location.country}`)
      .then(response => setCountryData(response.data))
      .catch(error => alert(error))
  }



  return (
    <div className='outerDiv'>
      <p className='loading'>Hello You! :)</p>
      {countryData ? <>
        <Card className='cardClass' style={{ width: '80vw' }}>

          <Card.Body>
            <Card.Title className='title'>Your IP is: {data.ip} ISP: {data.isp}<br />
You are located in {countryData.region}, <img src={countryData.flag} /> {countryData.altSpellings[1]}, {data.location.region}, {data.location.city}.</Card.Title>
            <Card.Text>
              <MapContainer className='mapContainer' center={[data.location.lat, data.location.lng]} zoom={10} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </Card.Text>
            <div className='title'>
              Local Time: {localTime.day}.{localTime.month}.{localTime.year}, {''}
              {localTime.hour < 10 ? `0${localTime.hour}` : localTime.hour}:
{localTime.minute < 10 ? `0${localTime.minute}` : localTime.minute}:
{localTime.second < 10 ? `0${localTime.second}` : localTime.second}
              <br />
London Time: {londonTime.eventDate[0]}.{londonTime.eventDate[1]}.{londonTime.eventDate[2]} {''}
              {londonTime.eventTime[0]}:
{londonTime.eventTime[1]}:
{londonTime.eventTime[2]}
              <br />
New York Time: {yorkTime.eventDate[0]}.{yorkTime.eventDate[1]}.{yorkTime.eventDate[2]} {''}
              {yorkTime.eventTime[0]}:
{yorkTime.eventTime[1]}:
{yorkTime.eventTime[2]}
            </div>
          </Card.Body>
        </Card></> : <div className="loading">Loading...</div>}
    </div>
  );
}

export default App;
