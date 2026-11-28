interface CsvPreviewProps {
  csvText: string;
}

export function CsvPreview({ csvText }: CsvPreviewProps) {
  if (!csvText) return null;

  return (
    <div>
      <h2>CSV 미리보기</h2>
      <pre>{csvText.slice(0, 500)}</pre>
    </div>
  );
}