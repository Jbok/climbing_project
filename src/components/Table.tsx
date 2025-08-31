import './Table.css'
import Problem from './Problem.tsx'

const rows = 5
const cols = 5
const cellSize: number = 120
const gap = 4

function Table() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gap: `${gap}px`
      }}>
      {Array.from({ length: rows * cols }, (_, i: number) => {
        return (
          <Problem
            key={i}
            cellSize={cellSize}
          />
        )
      })}
    </div>
  )
}

export default Table
