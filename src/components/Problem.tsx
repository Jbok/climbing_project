import './Problem.css'

function Problem(key: number, cellSize: number) {
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
