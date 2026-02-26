import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FileSpreadsheet, Upload, Loader2, X, FileCheck, Trash2 } from "lucide-react";
import { diamondService } from "@/services/diamondService";
import { getCookie } from "@/lib/cookie-utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ACCEPT_TYPES = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  productType?: string;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  open,
  onClose,
  onFileSelect,
  productType: overrideProductType,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const errorsRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const sellerType = useSelector((state: RootState) => state.seller.profile?.sellerType);

  let productType = overrideProductType || "diamond";
  if (!overrideProductType) {
    switch (sellerType) {
      case "naturalDiamond":
        productType = "diamond";
        break;
      case "labGrownDiamond":
        productType = "diamond";
        break;
      case "gemstone":
        productType = "gemstone";
        break;
      case "jewellery":
        productType = "jewellery";
        break;
      default:
        productType = "diamond";
    }
  }

  const productLabel =
    productType === "gemstone" || productType === "melee-gemstone" ? "Gemstones" : productType === "jewellery" ? "Jewellery" : "Diamonds";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [uploading, setUploading] = React.useState(false);
  const [downloadingSample, setDownloadingSample] = React.useState(false);
  const [uploadResult, setUploadResult] = React.useState<{
    inserted?: number;
    failed?: number;
    errors?: Array<{ row: number; errors: Array<{ field: string; constraints?: Record<string, string> }> }>;
  } | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const token = getCookie("token");
      if (!token) throw new Error("User not authenticated");
      const apiProductType = productType === "melee-gemstone" ? "gemstone" : productType;
      const result = await diamondService.uploadExcel(selectedFile, apiProductType, token);
      const raw = result as unknown as Record<string, unknown>;
      const data = (raw?.data ?? raw) as {
        success?: boolean;
        inserted?: number;
        failed?: number;
        errors?: Array<{ row: number; errors: Array<{ field: string; constraints?: Record<string, string> }> }>;
        message?: string;
      };
      const inserted = data?.inserted ?? 0;
      const failed = data?.failed ?? 0;
      const errs = data?.errors ?? [];
      setUploadResult({ inserted, failed, errors: errs });
      if (inserted > 0) {
        toast.success(
          `Uploaded ${inserted} item(s) successfully${failed > 0 ? `. ${failed} row(s) failed.` : ""}`
        );
        if (failed === 0) {
          onFileSelect(selectedFile);
          setSelectedFile(null);
        }
      } else if (errs.length > 0) {
        toast.error(`${errs.length} row(s) failed. See details below.`);
      } else {
        toast.error(data?.message || "Failed to upload. Check file format and column names.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload Excel file";
      const apiMsg = (err as { status?: number; message?: string })?.message;
      toast.error(apiMsg || msg);
      setUploadResult(null);
    } finally {
      setUploading(false);
    }
  };

  const clearResult = () => setUploadResult(null);

  // Scroll to errors when they appear
  useEffect(() => {
    if (uploadResult?.errors && uploadResult.errors.length > 0 && errorsRef.current) {
      errorsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [uploadResult?.errors]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const validExt = /\.(csv|xlsx|xls)$/i.test(file.name);
      if (validTypes.includes(file.type) || validExt) {
        setSelectedFile(file);
        setUploadResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      }
    }
  };

  const SAMPLE_FILE_MAP: Record<string, string> = {
    diamond: "/sample--diamond.xlsx",
    meleeDiamond: "/sample-melee-diamond.xlsx",
    gemstone: "/sample--gemstone.xlsx",
    "melee-gemstone": "/sample--gemstone.xlsx",
  };

  const handleSampleDownload = async () => {
    const samplePath = SAMPLE_FILE_MAP[productType] || SAMPLE_FILE_MAP.diamond;
    const fileName = samplePath.split("/").pop() || "sample.xlsx";
    setDownloadingSample(true);
    try {
      const res = await fetch(samplePath);
      if (!res.ok) throw new Error("Failed to fetch sample");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${fileName}`);
    } catch {
      toast.error("Failed to download sample file");
    } finally {
      setDownloadingSample(false);
    }
  };

  const handleClose = () => {
    clearResult();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md max-h-[90vh] min-h-[320px] overflow-hidden flex flex-col rounded-xl shadow-2xl border bg-[var(--card)] dark:bg-[var(--card)] text-[var(--card-foreground)] border-[var(--border)] dark:border-slate-700/50 z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-upload-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] dark:border-slate-700/50 shrink-0">
          <h2 id="bulk-upload-title" className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Bulk Upload {productLabel}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - scrollable area */}
        <div className="flex flex-col gap-5 overflow-y-auto overflow-x-hidden flex-1 min-h-0 p-6 overscroll-contain">
          <input
            type="file"
            accept={ACCEPT_TYPES}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Drop zone */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!uploading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              w-full rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200
              ${isDragging
                ? "border-[var(--primary)] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20"
                : "border-[var(--border)] dark:border-slate-600 hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/50 dark:hover:bg-slate-800/50"
              }
              ${uploading ? "pointer-events-none opacity-70" : ""}
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-4 rounded-full transition-colors ${
                  isDragging ? "bg-[var(--primary)]/20" : "bg-[var(--muted)] dark:bg-slate-700/50"
                }`}
              >
                <FileSpreadsheet
                  className={`w-10 h-10 ${isDragging ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
                />
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">
                  {isDragging ? "Drop your file here" : "Click or drag file here"}
                </p>
                <p className="text-sm text-[var(--muted-foreground)] mt-0.5">.csv, .xlsx supported (max 10MB)</p>
              </div>
            </div>
          </div>

          {/* Selected file card */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--muted)]/50 dark:bg-slate-800/50 border border-[var(--border)] dark:border-slate-700/50">
              <div className="p-2 rounded-lg bg-[var(--card)] dark:bg-slate-700/50">
                <FileCheck className="w-5 h-5 text-[var(--status-success)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{selectedFile.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  clearResult();
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={uploading}
                aria-label="Remove file"
                className="p-2 rounded-lg text-[var(--destructive)] hover:bg-[var(--destructive)]/10 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 dark:focus:ring-offset-[var(--card)]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSampleDownload}
              disabled={downloadingSample}
              className="w-full px-4 py-3 rounded-xl font-medium border border-[var(--border)] dark:border-slate-600 text-[var(--foreground)] hover:bg-[var(--muted)] dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloadingSample ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  Download Sample Excel
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-[var(--muted-foreground)] text-center">
            Upload an Excel or CSV file to add multiple {productLabel.toLowerCase()} at once.
          </p>

          {/* Error panel */}
          {uploadResult?.errors && uploadResult.errors.length > 0 && (
            <div
              ref={errorsRef}
              className="w-full rounded-xl overflow-hidden border shrink-0"
              style={{
                backgroundColor: "color-mix(in srgb, var(--destructive) 8%, transparent)",
                borderColor: "color-mix(in srgb, var(--destructive) 30%, transparent)",
              }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "color-mix(in srgb, var(--destructive) 30%, transparent)" }}
              >
                <h4 className="text-sm font-semibold" style={{ color: "var(--destructive)" }}>
                  {uploadResult.errors.length} product{uploadResult.errors.length !== 1 ? "s" : ""} failed
                </h4>
                {uploadResult.inserted !== undefined && uploadResult.inserted > 0 && (
                  <p className="text-xs mt-0.5 text-[var(--muted-foreground)]">
                    {uploadResult.inserted} row(s) uploaded successfully.
                  </p>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto p-3 space-y-2">
                {uploadResult.errors.map((err, idx) => (
                  <div
                    key={idx}
                    className="text-sm rounded-lg p-3"
                    style={{
                      backgroundColor: "var(--card)",
                      borderLeft: "3px solid var(--destructive)",
                    }}
                  >
                    <span className="font-medium text-[var(--foreground)]">Row {err.row}:</span>
                    <ul className="mt-1 ml-2 list-disc space-y-0.5 text-[var(--destructive)]">
                      {err.errors.map((e, i) => (
                        <li key={i}>{e.constraints ? Object.values(e.constraints).join(", ") : e.field}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div
                className="px-4 py-2 text-xs text-[var(--muted-foreground)] border-t"
                style={{ borderColor: "var(--border)" }}
              >
                Fix the errors in your file and upload again. Row numbers match the Excel/CSV row (header = row 1).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
