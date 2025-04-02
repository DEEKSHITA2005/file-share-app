import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewFilesPage: React.FC = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    "https://oauv21ola8.execute-api.ap-south-1.amazonaws.com/prod/retrieve"
                );
                setFiles(response.data.files || []);
            } catch (err) {
                console.error("Error fetching files:", err);
                setError("Failed to load files.");
            }
            setLoading(false);
        };
        fetchFiles();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">Files in S3 Bucket</h2>
            {loading && <p>Loading files...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">File Name</th>
                            <th className="border p-2">Size (Bytes)</th>
                            <th className="border p-2">Last Modified</th>
                            <th className="border p-2">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <tr key={index} className="border">
                                <td className="border p-2">{file.fileName}</td>
                                <td className="border p-2">{file.size}</td>
                                <td className="border p-2">{new Date(file.lastModified).toLocaleString()}</td>
                                <td className="border p-2">
                                    <a
                                        href={file.downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewFilesPage;
