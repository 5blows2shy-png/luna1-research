export function Score({ score }: { score: number }) {
  return (
    <div className="score" aria-label={`LUNA Score ${score} out of 100`}>
      <span>{score}</span>
      <small>
        LUNA
        <br />
        SCORE
      </small>
    </div>
  );
}
