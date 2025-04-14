import React, { useState } from 'react';
import { Search, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
}

function ShareFilePage() {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [receiverUsername, setReceiverUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const senderUsername = localStorage.getItem('username'); // currently logged-in user

  // Replace this with actual fetch to user files
  const files: FileData[] = [
    { id: '1', name: 'document1.pdf', type: 'PDF', size: '2.5 MB' },
    { id: '2', name: 'presentation.pptx', type: 'PowerPoint', size: '5.1 MB' },
    { id: '3', name: 'spreadsheet.xlsx', type: 'Excel', size: '1.8 MB' },
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = async () => {
    if (!selectedFile || !receiverUsername || !senderUsername) {
      toast.error('Please select a file and enter a username');
      return;
    }

    try {
      const response = await fetch('https://oauv21ola8.execute-api.ap-south-1.amazonaws.com/prod/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: senderUsername,
          receiver: receiverUsername,
          fileName: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`File shared with ${receiverUsername}`);
        setSelectedFile(null);
        setReceiverUsername('');
      } else {
        toast.error(data.message || 'Sharing failed');
      }
    } catch (err) {
      console.error('Error sharing file:', err);
      toast.error('Failed to share file');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Share Documents</h1>

        <div className="space-y-6">
          {/* File Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Select File</h2>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="border rounded-md overflow-hidden max-h-60 overflow-y-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                    selectedFile?.id === file.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.type} • {file.size}
                    </p>
                  </div>
                  <input
                    type="radio"
                    checked={selectedFile?.id === file.id}
                    onChange={() => setSelectedFile(file)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Share With</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={receiverUsername}
                  onChange={(e) => setReceiverUsername(e.target.value)}
                  placeholder="Enter username"
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <button
                onClick={handleShare}
                disabled={!selectedFile || !receiverUsername}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareFilePage;
