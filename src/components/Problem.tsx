import './Problem.css'

type ProblemProps = {
  key: number
  cellSize: number
}

function Problem({ key, cellSize }: ProblemProps) {
  return (
    <>
      <button
        key={key}
        className="problem"
        style={{
          width: cellSize,
          height: cellSize,
          border: '1px solid #ddd',
          boxSizing: 'border-box'
        }}></button>
    </>
  )
}

export default Problem
