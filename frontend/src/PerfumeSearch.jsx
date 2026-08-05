import { useState } from "react"

const PerfumeSearch = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const searchPerfumes = async (event) => {
    event.preventDefault() // stop the page from refreshing on submit
    setError("")
    setMessage("") //Without these, error messages stay even after successful search

    if (!query) {
      setError("Type a perfume name to search.")
      return
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search?q=${query}`
      )
      const data = await response.json()

      if (!response.ok) {
        setResults([])
        setError("Search failed.")
        return
      }

      setResults(data)

    } catch (err) {
      setResults([])
      setError("Could not reach the backend.")
    }
  }

  const addToCollection = async (perfume) => {
    setError("")
    setMessage("")

    const payload = {
      fragellaId: perfume.id ? String(perfume.id) : null,
      name: perfume.Name,
      brand: perfume.Brand || null,
      imageUrl: perfume["Image URL"] || null,
      notes: (perfume["General Notes"] || []).join(", "),
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Could not add to collection.")
        return
      }

      setMessage(`${perfume.Name} added to your collection!`)
    } catch (err) {
      setError("Could not reach the backend. Is Flask running?")
    }
  }

  return (
    <div className="perfume-search">
      <h2>Search for perfumes</h2>

      <form onSubmit={searchPerfumes}>
        <input
          type="text"
          placeholder="Enter a perfume name..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error ? <p className="search-error">{error}</p> : null}
      {message ? <p className="search-success">{message}</p> : null}

      <div className="perfume-results">
        {results.map((perfume) => (
          <div key={perfume.id || perfume.Name} className="perfume-card">
            {perfume["Image URL"] && (
              <img
                src={perfume["Image URL"]}
                alt={perfume.Name}
                className="perfume-image"
              />
            )}
            <h3>{perfume.Name}</h3>
            <p>
              <strong>Notes:</strong>{" "}
              {(perfume["General Notes"] || []).join(", ") || "No notes listed"}
            </p>
            <button type="button" onClick={() => addToCollection(perfume)}>
              Add to collection
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PerfumeSearch
