import { useState, useEffect } from 'react'

import type { HighlighAPIResponse } from './types'

function App() {
  const [highlights, setHighlights] = useState<HighlighAPIResponse | []>([])

  useEffect(() => {
    async function getHighlights() {
      fetch("http://localhost:8000/highlights?file_path=x")
        .then(res => res.json())
        .then(json => setHighlights(json))
        .catch(err => console.log(err))
    }
    getHighlights()
  }, [])

  return (
    <>
      {Object.entries(highlights).map(([key, value]) => {
        return (
          <div>
            <h3>{key}</h3>
            <ul>
              {value.map(v => <li>{v}</li>)}
            </ul>
          </div>
        )
      })}
    </>
  )
}

export default App
