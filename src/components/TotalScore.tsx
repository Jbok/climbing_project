type TotalScoreProps = {
  totalProblemNum: number
  completeProblemNum: number
}

function TotalScore({ totalProblemNum, completeProblemNum }: TotalScoreProps) {
  const completionRate =
    totalProblemNum === 0
      ? 0
      : ((completeProblemNum / totalProblemNum) * 100).toFixed(1)

  return (
    <>
      <h3>
        {completeProblemNum} / {totalProblemNum} ({completionRate} %)
      </h3>
    </>
  )
}

export default TotalScore
