import { useState, useEffect, ChangeEvent, Dispatch, SetStateAction, FormEvent, MouseEvent } from 'react'

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
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
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

  async function handleSelectHighlight(e: FormEvent) {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
    const selectedHighlights = formData.getAll('selectedHighlight')
  
    const response = await fetch("http://localhost:8000/generate-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/plain"
      },
      body: JSON.stringify({ selected_highlights: selectedHighlights })
    })
    if (response.ok) {
      const prompt = await response.text()
      setGeneratedPrompt(prompt)
      target.reset()
    }
  }

  function copyPrompt(e: MouseEvent) {
    e.preventDefault()
    navigator.clipboard
      .writeText(generatedPrompt)
      .then(() => {
        alert('Copied')
      })
  }

  return (
    <>
      <SelectHighlightsDate highlights={highlights} setSelectHighlights={setSelectHighlights}  />
      <form method='POST' onSubmit={handleSelectHighlight}>
      {Object.values(selectHighlights).map((chapterHighlights) => {
        return Object.values(chapterHighlights).map((highlight, index) => {
          return (
            <div key={index}>
              <input type='checkbox' id={`highlight-${index}`} name='selectedHighlight' value={highlight} />
              <label htmlFor={`highlight-${index}`}>{highlight}</label>
            </div>
          )
        })
      })}
      <button>Generate Prompt</button>
      </form>
      <div>
        <p>{generatedPrompt}</p>
        <button type='button' onClick={copyPrompt}>Copy</button>
      </div>
    </>
  )
}

export default App
