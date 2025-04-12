"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city)
      setCity("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="relative flex-1">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="w-full pl-10"
          aria-label="Search for a city"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      <button type="submit" className="search-button" aria-label="Search">
        Search
      </button>
    </form>
  )
}

export default SearchBar
