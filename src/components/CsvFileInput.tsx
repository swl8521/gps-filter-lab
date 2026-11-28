interface CsvFileInputProps {
  file: File | null;
  error: string | null;
  onFileSelect: (file: File) => void;
}

export function CsvFileInput({
  file,
  error,
  onFileSelect,
}: CsvFileInputProps) {

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 1. 선택된 File 객체 추출    
    const selectedFile = event.target.files?.[0];
    // 2. 선택된 파일이 없으면 종료

    if (!selectedFile) return;
    // 3. onFileSelect 호출  
    onFileSelect(selectedFile);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      {file && (<p>선택한 파일: {file.name}</p>)}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}