import './Problem.css'
import { useState } from 'react'
import clearStampImsage from '../assets/clear_stamp.png'

type ProblemProps = {
  key: number
  cellSize: number
}

function Problem({ key, cellSize }: ProblemProps) {
  const [showCircle, setShowCircle] = useState(false)

  return (
    <div
      className="problem-container"
      style={{ width: cellSize, height: cellSize }}>
      <button
        key={key}
        className="problem"
        onClick={() => setShowCircle(prev => !prev)}
        style={{ width: '100%', height: '100%' }}></button>
      {showCircle && (
        <div className="clear_stamp_overlay">
          <img
            src={clearStampImsage}
            alt="circle"
            className="clear_stamp_image"
          />
        </div>
      )}
    </div>
  )
}

export default Problem
