import React from "react";
import { toast } from "react-hot-toast";
import { diamondService } from "@/services/diamondService";
import { getCookie } from "@/lib/cookie-utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  open,
  onClose,
  onFileSelect,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const sellerType = useSelector((state: RootState) => state.seller.profile?.sellerType);
  // Determine productType based on sellerType (switch/case style)
  let productType = 'diamond';
  switch (sellerType) {
    case 'naturalDiamond':
      productType = 'diamond';
      break;
    case 'labGrownDiamond':
      productType = 'lab-grown-diamond';
      break;
    case 'gemstone':
      productType = 'gemstone';
      break;
    case 'jewellery':
      productType = 'jewellery';
      break;
    default:
      productType = 'diamond';
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [uploading, setUploading] = React.useState(false);
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const token = getCookie("token");
      if (!token) throw new Error("User not authenticated");
      await diamondService.uploadExcel(selectedFile, productType, token);
      toast.success("Excel uploaded successfully!");
      onFileSelect(selectedFile); // Notify parent if needed
      setSelectedFile(null);
    } catch (err) {
      toast.error("Failed to upload Excel file");
    } finally {
      setUploading(false);
    }
  };

  const handleSampleDownload = () => {
    // Use the correct sample file path and name
    const sampleUrl = "/sample-diamond.xlsx";
    const link = document.createElement("a");
    link.href = sampleUrl;
    link.download = "sample-diamond.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ✅ Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose} // click outside to close
      />

      {/* ✅ Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="text-lg font-semibold mb-4">Bulk Upload Diamonds</h3>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className="w-full border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files?.[0];
              if (file) setSelectedFile(file);
            }}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <span className="text-blue-700 font-medium">
                Click or drag and drop Excel/CSV file here
              </span>
              <span className="text-xs text-gray-500">
                .csv, .xlsx supported
              </span>
            </div>
          </div>
          {selectedFile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
              <button
                className="text-xs text-red-500 hover:underline"
                onClick={() => setSelectedFile(null)}
                type="button"
              >
                Remove
              </button>
            </div>
          )}
          <button
            className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition w-full disabled:opacity-50"
            onClick={handleUpload}
            type="button"
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300 transition w-full"
            onClick={handleSampleDownload}
            type="button"
          >
            Download Sample Excel
          </button>
          <p className="text-sm text-gray-500">
            Upload an Excel or CSV file to add multiple diamonds at once.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
