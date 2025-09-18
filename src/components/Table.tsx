import './Table.css'
import Problem from './Problem.tsx'
import TotalScore from './TotalScore.tsx'
import { db } from './Firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useState, useEffect, useCallback } from 'react'

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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalProblemNum, setTotalProblemNum] = useState<number>(0)
  const [completeProblemNum, setCompleteProblemNum] = useState<number>(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const data = await getAllProblems()
      if (cancelled) return
      setProblems(data)
      setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setTotalProblemNum(problems.filter(p => p.name.trim() !== '').length)
    setCompleteProblemNum(problems.filter(p => p.isDone).length)
  }, [problems, isLoading])

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

  const handleProblemChange = useCallback(
    (id: string, name: string, isDone: boolean) => {
      setProblems(prev =>
        prev.map(p => (p.id === id ? { id, name, isDone } : p))
      )
    },
    []
  )

  if (isLoading) {
    return <div className="table-container">Loading...</div>
  }

  return (
    <>
      <TotalScore
        totalProblemNum={totalProblemNum}
        completeProblemNum={completeProblemNum}
      />
      {console.log(problems)}
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
                onChange={handleProblemChange}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Table
