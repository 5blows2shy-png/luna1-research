export function Score({ score }: { score: number }) {
  return (
    <div className="score" aria-label={`Klyro Score ${score} out of 100`}>
      <span>{score}</span>
      <small>
        KLYRO
        <br />
        SCORE
      </small>
    </div>
  );
}
