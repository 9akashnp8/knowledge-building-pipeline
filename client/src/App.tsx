import { useState, useEffect, FormEvent, MouseEvent } from 'react'

import ChapterSelect from './components/ChapterSelect'
import DateSelect from './components/DateSelect'
import type { HighlighAPIResponse } from './types'


function App() {
  const [highlights, setHighlights] = useState<HighlighAPIResponse | {}>({})
  const [ selectedChaper, setSelectedChaper ] = useState<string>("")
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [selectHighlights, setSelectHighlights] = useState<[]>([])
  
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
      <ChapterSelect chapters={Object.keys(highlights)} setSelectedChaper={setSelectedChaper} setSelectHighlights={setSelectHighlights} />
      <DateSelect selectedChapter={selectedChaper} highlights={highlights} setSelectHighlights={setSelectHighlights}  />
      <form method='POST' onSubmit={handleSelectHighlight}>
      {Object.values(selectHighlights).map((highlight, index) => {
        return (
          <div key={index}>
            <input type='checkbox' id={`highlight-${index}`} name='selectedHighlight' value={highlight} />
            <label htmlFor={`highlight-${index}`}>{highlight}</label>
          </div>
        )
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
