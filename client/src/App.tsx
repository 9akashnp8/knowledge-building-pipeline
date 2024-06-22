import { useState, useEffect, ChangeEvent, Dispatch, SetStateAction, FormEvent } from 'react'

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

  function handleSelectHighlight(e: FormEvent) {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    console.log(formData.getAll('selectedHighlight'))
  }

  return (
    <>
      <SelectHighlightsDate highlights={highlights} setSelectHighlights={setSelectHighlights}  />
      <form method='POST' onSubmit={handleSelectHighlight}>
      {Object.values(selectHighlights).map((highlightData, index) => {
        return (
          <div key={index}>
            <input type='checkbox' id={`highlightData-${index}`} name='selectedHighlight' value={highlightData} />
            <label htmlFor={`highlightData-${index}`}>{highlightData}</label>
          </div>
        )
      })}
      <button>Generate Prompt</button>
      </form>
    </>
  )
}

export default App
