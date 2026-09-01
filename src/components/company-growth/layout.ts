export function getMediaAnchorPercent({
  imageSize,
  subjectPoint,
}: {
  imageSize: number;
  subjectPoint: number;
}) {
  const percentage = Math.min(
    100,
    Math.max(0, (subjectPoint / imageSize) * 100),
  );
  return `${Math.round(percentage * 10) / 10}%`;
}
