import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];

function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [username, setUsername] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFiles = (incomingFiles: File[]) => {
    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    incomingFiles.forEach((file) => {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(file.name);
      }
    });

    if (rejectedFiles.length) {
      toast.error(`Unsupported file(s): ${rejectedFiles.join(', ')}`);
    }

    return validFiles;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = validateFiles(selectedFiles);
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username.');
      return;
    }

    if (files.length === 0) {
      toast.error('Please select files to upload.');
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const res = await fetch("https://oauv21ola8.execute-api.ap-south-1.amazonaws.com/prod/upload", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            filename: file.name,
            filetype: file.type,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || `Failed to get upload URL for ${file.name}`);

        const s3Res = await fetch(data.uploadURL, {
          method: 'PUT',
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!s3Res.ok) throw new Error(`Failed to upload ${file.name}`);

        return file.name;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      toast.success(`Uploaded: ${uploadedFiles.join(', ')}`);
      setFiles([]);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Files</h2>

      <input
        type="text"
        className="w-full border p-2 mb-4 rounded"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div
        className={`border-2 border-dashed p-6 rounded-lg text-center transition ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto mb-2" />
        <p>Drag and drop files here or</p>
        <label className="cursor-pointer text-blue-600 underline">
          select files
          <input type="file" multiple className="hidden" onChange={handleFileSelect} />
        </label>
        <p className="text-sm text-gray-500 mt-1">Allowed: PDF, Word, Excel, TXT</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium">Files to upload:</h4>
          <ul className="space-y-2 mt-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center border p-2 rounded">
                <span>{file.name}</span>
                <button onClick={() => removeFile(index)}>
                  <X className="text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default UploadPage;
