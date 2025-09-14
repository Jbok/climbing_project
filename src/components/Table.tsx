import './Table.css'
import Problem from './Problem.tsx'
import { useState } from 'react'

const rows = 6
const cols = 3
const gap = 4

function Table() {
  // 412x915 화면에 맞춰 셀 크기 계산
  const maxWidth = 412
  const maxHeight = 915
  const padding = 32 // 좌우 패딩 고려
  const availableWidth = maxWidth - padding
  const availableHeight = maxHeight - padding

  // 그리드가 화면에 맞도록 셀 크기 조정
  const adjustedCellSize = Math.min(
    Math.floor((availableWidth - gap * (cols - 1)) / cols),
    Math.floor((availableHeight - gap * (rows - 1)) / rows),
    100 // 최소 크기
  )

  const [completedStates, setCompletedStates] = useState<boolean[]>(
    Array(rows * cols).fill(false)
  )

  // ✅ Problem에서 호출할 콜백
  const handleCompleteChange = (id: number, completed: boolean) => {
    setCompletedStates(prev => {
      const newStates = [...prev]
      newStates[id] = completed
      return newStates
    })
  }

  const [nameStates, setNameStates] = useState<boolean[]>(
    Array(rows * cols).fill(false)
  )

  const handleNameChange = (id: number, hasName: boolean) => {
    setNameStates(prev => {
      const newStates = [...prev]
      newStates[id] = hasName
      return newStates
    })
  }

  // ✅ 완료된 개수 계산
  const completedCount = completedStates.filter(Boolean).length
  const nameCount = nameStates.filter(Boolean).length

  return (
    <>
      <h3>
        {completedCount} / {nameCount} (
        {((completedCount / nameCount) * 100).toFixed(1)} %)
      </h3>
      <div className="table-container">
        <div
          className="problem-grid"
          style={{
            gridTemplateRows: `repeat(${rows}, ${adjustedCellSize}px)`,
            gridTemplateColumns: `repeat(${cols}, ${adjustedCellSize}px)`
          }}>
          {Array.from({ length: rows * cols }, (_, i: number) => {
            return (
              <Problem
                id={i}
                onCompleteChange={handleCompleteChange}
                onNameChange={handleNameChange}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Table
