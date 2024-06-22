import { useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react'

import type { HighlighAPIResponse } from './types'

type Props = {
  highlights: HighlighAPIResponse,
  setSelectHighlights: Dispatch<SetStateAction<any>>
}

function SelectHighlightsDate({ highlights, setSelectHighlights }: Props) {

  function handleChange(e: ChangeEvent) {
    e.preventDefault()
    const target = e.target as HTMLInputElement
    const selectedDate = target.value;
    setSelectHighlights(highlights[selectedDate])
  }

  return (
    <select onChange={handleChange}>
      <option value="">Select Date</option>
      {Object.keys(highlights).map((date) => {
        return <option value={date}>{date}</option>
      })}
    </select>
  )
}

function App() {
  const [highlights, setHighlights] = useState<HighlighAPIResponse | {}>({})
  const [selectHighlights, setSelectHighlights] = useState<HighlighAPIResponse | {}>({})
  
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
      <SelectHighlightsDate highlights={highlights} setSelectHighlights={setSelectHighlights}  />
      <ul>
      {Object.values(selectHighlights).map((highlightData) => {
        return (
          <li>{highlightData}</li>
        )
      })}
      </ul>
    </>
  )
}

export default App
