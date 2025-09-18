import './Table.css'
import Problem from './Problem.tsx'
import TotalScore from './TotalScore.tsx'
import { db } from './Firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useState, useEffect, useCallback } from 'react'
import type { ReactElement } from 'react'

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
  const maxWidth = 400
  const maxHeight = 900
  const padding = 32 // 좌우 패딩 고려
  const availableWidth = maxWidth - padding
  const availableHeight = maxHeight - padding

  // 라벨 컬럼 너비
  const labelWidth = 72

  // 그리드가 화면에 맞도록 셀 크기 조정
  // (라벨 1칸 + 문제 cols칸, 컬럼 사이 간격은 cols개)
  const adjustedCellSize = Math.min(
    Math.floor((availableWidth - labelWidth - gap * cols) / cols),
    Math.floor((availableHeight - gap * (rows - 1)) / rows),
    100 // 기존 로직 유지
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

  // "Sector A/B/..." 라벨 생성
  const sectorLabel = (r: number) => `Sector ${String.fromCharCode(65 + r)}`

  // 라벨 + 문제 셀들을 순서대로 쌓기
  const gridCells: ReactElement[] = []
  for (let r = 0; r < rows; r++) {
    gridCells.push(
      <div
        key={`label-${r}`}
        className="row-label">
        {sectorLabel(r)}
      </div>
    )
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      const problem = problems[i]
      gridCells.push(
        <Problem
          key={problem?.id ?? `empty-${i}`}
          id={problem?.id ?? ''}
          name={problem?.name ?? ''}
          isDone={!!problem?.isDone}
          onChange={handleProblemChange}
        />
      )
    }
  }

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
            gridTemplateColumns: `${labelWidth}px repeat(${cols}, ${adjustedCellSize}px)`,
            gap: `${gap}px`
          }}>
          {gridCells}
        </div>
      </div>
    </>
  )
}

export default Table
