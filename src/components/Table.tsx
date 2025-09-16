import './Table.css'
import Problem from './Problem.tsx'
import TotalScore from './TotalScore.tsx'
import { db } from './Firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'

const rows = 6
const cols = 3
const gap = 4

async function getAllProblems(): Promise<Problem[]> {
  const snap = await getDocs(collection(db, 'problems'))
  return snap.docs.map(d => {
    const data = d.data() as { id?: string; name?: string; isDone?: boolean }
    return {
      id: d.id,
      name: data.name ?? '',
      isDone: !!data.isDone
    }
  })
}

type Problem = {
  id: string
  name: string
  isDone: boolean
}

function Table() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [totalProblemNum, setTotalProblemNum] = useState<number>(0)
  const [completeProblemNum, setCompleteProblemNum] = useState<number>(0)

  useEffect(() => {
    getAllProblems().then(data => {
      setProblems(data)
      setTotalProblemNum(data.filter(p => p.name.trim() !== '').length)
      setCompleteProblemNum(data.filter(p => p.isDone).length)
    })
  }, [])

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

  return (
    <>
      <TotalScore
        totalProblemNum={totalProblemNum}
        completeProblemNum={completeProblemNum}
      />
      <div className="table-container">
        <div
          className="problem-grid"
          style={{
            gridTemplateRows: `repeat(${rows}, ${adjustedCellSize}px)`,
            gridTemplateColumns: `repeat(${cols}, ${adjustedCellSize}px)`
          }}>
          {Array.from({ length: rows * cols }, (_, i: number) => {
            const problem = problems[i]
            return (
              <Problem
                id={problem?.id ?? ''}
                name={problem?.name ?? ''}
                isDone={!!problem?.isDone}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Table
