import { useEffect, useState } from "react"

const PerfumeCollection = () => {
  const [perfumes, setPerfumes] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [expandedId, setExpandedId] = useState(null) // which card's details are open
  const [draft, setDraft] = useState({ purchasedAt: "", wouldBuyAgain: "" })

  const fetchCollection = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/collection")
      const data = await response.json()

      if (!response.ok) {
        setError("Could not load collection.")
        return
      }
      setPerfumes(data.perfumes || [])
      setError("")
    } catch (err) {
      setError("Could not reach the backend.")
    }
  }

  useEffect(() => {
    fetchCollection()
  }, [])

  const removeFromCollection = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/collection/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setExpandedId(null)
        fetchCollection()
      } else {
        const data = await response.json()
        setError(data.message || "Could not remove perfume.")
      }
    } catch (err) {
      setError("Could not reach the backend.")
    }
  }

  const toggleDetails = (perfume) => {
    if (expandedId === perfume.id) {
      setExpandedId(null)
      return
    }

    setExpandedId(perfume.id)
    setMessage("")
    setDraft({
      purchasedAt: perfume.purchasedAt || "",
      wouldBuyAgain:
        perfume.wouldBuyAgain === true ? "yes" 
        : perfume.wouldBuyAgain === false ? "no"
        : "",
    })
  }

  const saveDetails = async (id) => {
    setError("")
    setMessage("")

    const payload = {
      purchasedAt: draft.purchasedAt || null,
      wouldBuyAgain:
        draft.wouldBuyAgain === "yes" ? true : draft.wouldBuyAgain === "no" ? false : null,
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/collection/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Could not save details.")
        return
      }

      setMessage("Saved!")
      fetchCollection()
    } catch (err) {
      setError("Could not reach the backend. Is Flask running?")
    }
  }

  return (
    <div className="perfume-collection">
      <h2>My Collection</h2>
      {error ? <p className="search-error">{error}</p> : null}
      {message ? <p className="search-success">{message}</p> : null}
      {perfumes.length === 0 && !error && (
        <p>No perfumes saved yet. Search and add some!</p>
      )}
      <div className="perfume-results">
        {perfumes.map((perfume) => {
          const isExpanded = expandedId === perfume.id

          return (
            <div key={perfume.id} className="perfume-card">
              {perfume.imageUrl && (
                <img
                  src={perfume.imageUrl}
                  alt={perfume.name}
                  className="perfume-image"
                />
              )}
              <h3>{perfume.name}</h3>

              <button type="button" onClick={() => toggleDetails(perfume)}>
                {isExpanded ? "Hide details" : "Show details"}
              </button>

              {isExpanded && (
                <div className="perfume-details">
                  {perfume.brand && <p>{perfume.brand}</p>}
                  <p>
                    <strong>Notes:</strong> {perfume.notes || "No notes listed"}
                  </p>

                  <div className="detail-field">
                    <label htmlFor={`bought-${perfume.id}`}>When did you buy it?</label>
                    <input
                      id={`bought-${perfume.id}`}
                      type="date"
                      value={draft.purchasedAt}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, purchasedAt: e.target.value }))
                      }
                    />
                  </div>

                  <div className="detail-field">
                    <label htmlFor={`again-${perfume.id}`}>Would you buy it again?</label>
                    <select
                      id={`again-${perfume.id}`}
                      value={draft.wouldBuyAgain}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          wouldBuyAgain: e.target.value,
                        }))
                      }
                    >
                      <option value="">Not sure yet</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <button type="button" onClick={() => saveDetails(perfume.id)}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCollection(perfume.id)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PerfumeCollection
