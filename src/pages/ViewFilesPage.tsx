import React, { useState } from "react";
import axios from "axios";

const ViewFilesPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = async () => {
        if (!username) {
            setError("Please enter the access code.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://oauv21ola8.execute-api.ap-south-1.amazonaws.com/prod/retrieve?username=${username}`
            );
            setFiles(response.data);
        } catch (err) {
            console.error("Error fetching files:", err);
            setError("Failed to load files.");
        }

        setLoading(false);
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Retrieve Uploaded Files</h2>

            <div className="mb-4 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border px-3 py-2 rounded w-64"
                />
                <button
                    onClick={fetchFiles}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Search
                </button>
            </div>

            {loading && <p>Loading files...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {files.length > 0 && (
                <ul className="mt-4 space-y-4">
                    {files.map((file, idx) => (
                        <li key={idx} className="border p-4 rounded shadow-md">
                            <p><strong>Filename:</strong> {file.filename}</p>
                            <p><strong>Size:</strong> {file.size} bytes</p>
                            <p><strong>Last Modified:</strong> {new Date(file.lastModified).toLocaleString()}</p>
                            <a
                                href={file.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Download File
                            </a>
                        </li>
                    ))}
                </ul>
            )}

            {!loading && files.length === 0 && !error && (
                <p>No files found for this user.</p>
            )}
        </div>
    );
};

export default ViewFilesPage;
