
"use client"

import { useEffect, useState } from "react"
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle } from "lucide-react"

export interface WeatherData {
    temperature: number
    weatherCode: number
    icon: React.ElementType
    text: string
}

export const useWeather = (latitude: number, longitude: number) => {
    const [data, setData] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`
                )
                if (!response.ok) throw new Error('Weather data fetch failed')
                const json = await response.json()
                const current = json.current

                setData({
                    temperature: current.temperature_2m,
                    weatherCode: current.weather_code,
                    icon: getWeatherIcon(current.weather_code),
                    text: getWeatherText(current.weather_code)
                })
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error")
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
        const interval = setInterval(fetchWeather, 1000 * 60 * 30) // Update every 30 mins
        return () => clearInterval(interval)
    }, [latitude, longitude])

    return { data, loading, error }
}

function getWeatherIcon(code: number) {
    if (code === 0) return Sun
    if (code >= 1 && code <= 3) return Cloud
    if (code >= 45 && code <= 48) return CloudFog
    if (code >= 51 && code <= 55) return CloudDrizzle
    if (code >= 56 && code <= 57) return CloudDrizzle
    if (code >= 61 && code <= 67) return CloudRain
    if (code >= 71 && code <= 77) return CloudSnow
    if (code >= 80 && code <= 82) return CloudRain
    if (code >= 85 && code <= 86) return CloudSnow
    if (code >= 95 && code <= 99) return CloudLightning
    return Sun
}

function getWeatherText(code: number) {
    if (code === 0) return "Clear"
    if (code >= 1 && code <= 3) return "Cloudy"
    if (code >= 45 && code <= 48) return "Fog"
    if (code >= 51 && code <= 55) return "Drizzle"
    if (code >= 56 && code <= 57) return "Frz Drizzle"
    if (code >= 61 && code <= 67) return "Rain"
    if (code >= 71 && code <= 77) return "Snow"
    if (code >= 80 && code <= 82) return "Showers"
    if (code >= 85 && code <= 86) return "Snow Showers"
    if (code >= 95 && code <= 99) return "Thunderstorm"
    return "Unknown"
}
