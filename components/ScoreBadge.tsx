export default function ScoreBadge({ passed }: { passed: boolean }) {
  return (
    <span
      className={`badge ${
        passed
          ? "bg-green-100 dark:bg-green-900/40"
          : "bg-red-100 dark:bg-red-900/40"
      }`}
    >
      {passed ? "Passed" : "Try Again"}
    </span>
  );
}
