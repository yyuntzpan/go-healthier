import React, { useCallback, useEffect, useState } from 'react'
import GymCardSpot from './gymCard-spot'
import styles from './map-erea.module.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'

function GoogleMapsComponent({ apiKey, gymsData, searchTerm }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })
  const mapStyles = {
    height: '100%',
    width: '100%',
  }

  const [center, setCenter] = useState({
    lat: 25.04510954594513,
    lng: 121.52343310812854,
  })
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [map, setMap] = useState(null)
  const [sortedGyms, setSortedGyms] = useState([])
  const [geoJsonData, setGeoJsonData] = useState(null)

  const handleMapClick = () => {
    setSelectedMarker(null)
  }

  const gymsDatatoGeoJson = useCallback((gymsData) => {
    if (!Array.isArray(gymsData)) {
      console.error('Invalid gymsData Structure .應該要是 Array', gymsData)
      return null
    }

    // 1. 先轉成 GeoJson
    return {
      type: 'FeatureCollection',
      features: gymsData.map((gym) => ({
        type: 'Feature',
        properties: {
          id: gym.gym_id,
          name: gym.gym_name,
          subtitle: gym.gym_subtitle,
          address: gym.gym_address,
          phone: gym.gym_phone,
          businessHours: gym.business_hours,
          gym_info: gym.gym_info,
          gym_price: gym.gym_price,
          gym_equipment: gym.gym_equipment,
          is_elderly: gym.is_elderly,
          features: gym.feature_list,
          images: gym.image_list,
        },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(gym.longitude), parseFloat(gym.latitude)],
        },
      })),
    }
  }, [])

  const handleSearch = useCallback(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: searchTerm }, (results, status) => {
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location
          setCenter({ lat: lat(), lng: lng() })
          // calculateDistances({ lat: lat(), lng: lng() })
          if (map) {
            map.panTo({ lat: lat(), lng: lng() })
          }
        } else {
          console.log(
            'Geocode was not successful for the following reason: ' + status
          )
        }
      })
    }
  }, [isLoaded, searchTerm, map])

  const calculateDistances = useCallback(
    (origin) => {
      if (!isLoaded || !geoJsonData) return

      const service = new window.google.maps.DistanceMatrixService()
      const gyms = geoJsonData.features

      const batchSize = 15
      const batches = []
      for (let i = 0; i < gyms.length; i += batchSize) {
        batches.push(gyms.slice(i, i + batchSize))
      }

      const promises = batches.map((batch) => {
        return new Promise((resolve) => {
          service.getDistanceMatrix(
            {
              origins: [origin],
              destinations: batch.map((gym) => ({
                lat: gym.geometry.coordinates[1],
                lng: gym.geometry.coordinates[0],
              })),
              travelMode: 'WALKING',
            },
            (response, status) => {
              if (status === 'OK') {
                resolve(response.rows[0].elements)
              } else {
                console.error(`Error was: ${status}`)
                resolve([])
              }
            }
          )
        })
      })

      Promise.all(promises).then((results) => {
        const flatResults = results.flat()
        const sortedGyms = gyms
          .map((gym, index) => ({
            ...gym,
            distance: flatResults[index].distance.value,
            duration: flatResults[index].duration.text,
          }))
          .sort((a, b) => a.distance - b.distance)

        setSortedGyms(sortedGyms)
      })
    },
    [isLoaded, geoJsonData]
  )

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (gymsData && apiKey) {
      const covertedData = gymsDatatoGeoJson(gymsData)
      setGeoJsonData(covertedData)
    }
  }, [gymsData, apiKey])

  useEffect(() => {
    if (isLoaded && searchTerm) {
      handleSearch()
    }
  }, [isLoaded, searchTerm, handleSearch])

  if (!isLoaded) {
    return <Skeleton count={1} width={'100%'} height={'100%'} />
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={center}
      onClick={handleMapClick}
      onLoad={(map) => setMap(map)}
      onUnmount={onUnmount}
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker
        position={center}
        options={{
          icon: {
            url: '/map-marker-smile-fill.svg',
            scaledSize: new window.google.maps.Size(50, 50),
          },
        }}
      />
      {geoJsonData &&
        geoJsonData.features &&
        geoJsonData.features.map((feature) => (
          <Marker
            key={feature.properties.id}
            position={{
              lat: feature.geometry.coordinates[1],
              lng: feature.geometry.coordinates[0],
            }}
            onClick={() => setSelectedMarker(feature)}
            title={feature.properties.gym_name}
            options={{
              icon: {
                url: '/fi-sr-marker.svg',
                scaledSize: new window.google.maps.Size(50, 50),
              },
            }}
          />
        ))}
      {selectedMarker && (
        <InfoWindow
          position={{
            lat: selectedMarker.geometry.coordinates[1],
            lng: selectedMarker.geometry.coordinates[0],
          }}
          onCloseClick={() => setSelectedMarker(null)}
          options={{
            pixelOffset: new window.google.maps.Size(0, -40),
            // className: styles.infoWindow,
          }}
        >
          <div className={styles.infoWindow}>
            <GymCardSpot data={selectedMarker.properties} variant="A" />
          </div>
        </InfoWindow>
      )}
      {/* {console.log(selectedMarker.properties)} */}
    </GoogleMap>
  )
}

export default function MapErea({ gymsData, searchTerm }) {
  const [apiKey, setApiKey] = useState(null)
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const url = `http://localhost:3001/gyms/mapkey`
        const res = await fetch(url) // 向後端請求 API Key
        const data = await res.json()
        setApiKey(data.apiKey)
      } catch (error) {
        console.error('Error fetching API key:', error)
      }
    }
    fetchApiKey()
  }, [])

  if (!apiKey) {
    return (
      <h5 style={{ textAlign: 'center', lineHeight: '300px' }}>
        Fetching API Key...
      </h5>
    )
  }
  return (
    <GoogleMapsComponent
      apiKey={apiKey}
      gymsData={gymsData}
      searchTerm={searchTerm}
    />
  )
}
