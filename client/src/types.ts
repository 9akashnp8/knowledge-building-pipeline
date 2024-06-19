
type HighlightDate = string

type Highlights = string[]

export type Highlight = Record<HighlightDate, Highlights>

export type HighlighAPIResponse = Highlight[]
