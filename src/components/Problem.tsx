import './Problem.css'
import { db } from './Firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useState, useCallback, useEffect } from 'react'
import clearStampImsage from '../assets/clear_stamp.png'
import ProblemModal from './ProblemModal.tsx'

type ProblemProps = {
  id: string
  name: string
  isDone: boolean
  onChange: (id: string, name: string, isDone: boolean) => void
}

function Problem({ id, name, isDone, onChange }: ProblemProps) {
  const [problemProps, setProblemProps] = useState<ProblemProps>({
    id,
    name,
    isDone,
    onChange
  })

  useEffect(() => {
    setProblemProps({ id, name, isDone, onChange })
  }, [])

  useEffect(() => {
    onChange(problemProps.id, problemProps.name, problemProps.isDone)
  }, [problemProps])

  useEffect(() => {
    ;(async () => {
      try {
        await updateDoc(doc(db, 'problems', id), {
          name: problemProps.name,
          isDone: problemProps.isDone
        })
      } catch (e) {
        console.error('updateDoc 실패:', e)
        // 문서가 없을 수 있으면 setDoc(…, { merge: true }) 고려
      }
    })()
  }, [id, name, isDone])

  const changeProblemName = (newName: string) => {
    setProblemProps(prev => ({
      ...prev,
      name: newName,
      isDone: false
    }))
    setShowProblemModal(false)
  }

  const clearProblem = () => {
    setProblemProps(prev => ({
      ...prev,
      isDone: true
    }))
    setShowProblemModal(false)
  }

  const unclearProblem = () => {
    setProblemProps(prev => ({
      ...prev,
      isDone: false
    }))
    setShowProblemModal(false)
  }

  const [showProblemModal, setShowProblemModal] = useState(false)
  const openProblemModal = () => setShowProblemModal(true)
  const closeProblemModal = () => setShowProblemModal(false)

  return (
    <div className="problem-container">
      {/* 메인 버튼 */}
      <button
        className="problem problem-button"
        onClick={openProblemModal}>
        {problemProps?.name}
      </button>

      {/* 완료 스탬프 */}
      {problemProps?.isDone && (
        <div className="clear_stamp_overlay">
          <img
            src={clearStampImsage}
            alt="완료 스탬프"
            className="clear_stamp_image"
          />
        </div>
      )}

      {showProblemModal && (
        <ProblemModal
          name={problemProps?.name}
          isDone={problemProps?.isDone}
          onClose={closeProblemModal}
          onClear={clearProblem}
          onUnclear={unclearProblem}
          onEdit={changeProblemName}
        />
      )}
    </div>
  )
}

export default Problem
