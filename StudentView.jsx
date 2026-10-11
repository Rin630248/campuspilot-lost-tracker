import { useEffect, useState } from 'react'
import ItemCard from './ItemCard'

const PUBLIC_ITEMS_ENDPOINT = '/api/items/'

function normalizeItemsResponse(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  return []
}

function StudentView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [appliedCategory, setAppliedCategory] = useState('all')

  useEffect(() => {
    const controller = new AbortController()
    const normalizedSearch = search.trim()

    async function loadItems() {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()

      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      if (normalizedSearch) {
        params.set('search', normalizedSearch)
      }

      const requestUrl = params.toString()
        ? `${PUBLIC_ITEMS_ENDPOINT}?${params.toString()}`
        : PUBLIC_ITEMS_ENDPOINT

      try {
        const response = await fetch(requestUrl, {
          signal: controller.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        setItems(normalizeItemsResponse(payload))
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return
        }

        setItems([])
        setError('Unable to load items right now. Please try again.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadItems()

    return () => controller.abort()
  }, [search, statusFilter])

  function handleSearchSubmit(event) {
    event.preventDefault()
    setAppliedCategory(selectedCategory)
  }

  function handleSearchChange(event) {
    setSearch(event.target.value)
  }

  function handleStatusFilterChange(nextStatus) {
    setStatusFilter(nextStatus)
  }

  const visibleItems =
    appliedCategory === 'all'
      ? items
      : items.filter((item) => item.category === appliedCategory)

  return (
    <div className="student-lostfound-view">

      <section className="browse-hero">
        <h1>Lost something on campus?</h1>
        <p>
          Search our official registry of found items to reclaim your property.
        </p>

        <form className="stitch-search-row" onSubmit={handleSearchSubmit}>
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Keys & Wallets">Keys &amp; Wallets</option>
            <option value="Books & Study">Books &amp; Study</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Search by Item No., Name, Category, or Location..."
            value={search}
            onChange={handleSearchChange}
          />

          <button type="submit" className="search-button">
            SEARCH
          </button>
        </form>
      </section>

      <section className="browse-content">

        <div className="status-tabs">
          <button
            type="button"
            className={statusFilter === 'all' ? 'tab active' : 'tab'}
            onClick={() => handleStatusFilterChange('all')}
          >
            All Items <span>{visibleItems.length}</span>
          </button>

          <button
            type="button"
            className={statusFilter === 'pending' ? 'tab active' : 'tab'}
            onClick={() => handleStatusFilterChange('pending')}
          >
            Pending
          </button>

          <button
            type="button"
            className={statusFilter === 'completed' ? 'tab active' : 'tab'}
            onClick={() => handleStatusFilterChange('completed')}
          >
            Completed
          </button>
        </div>

        {error && (
          <p className="state-message state-message--error">
            {error}
          </p>
        )}

        {!error && loading && (
          <p className="state-message">
            Fetching the latest lost and found items...
          </p>
        )}

        {!error && !loading && visibleItems.length === 0 && (
          <p className="state-message">
            No items found.
          </p>
        )}

        <div className="item-grid stitch-grid">
          {visibleItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

        {!loading && visibleItems.length > 0 && (
          <div
            className="pagination"
            aria-label="Pagination"
          >
            <button type="button" disabled>
              {'<'}
            </button>

            <button
              type="button"
              className="active"
            >
              1
            </button>

            <button type="button" disabled>
              {'>'}
            </button>
          </div>
        )}

      </section>
    </div>
  )
}

export default StudentView
