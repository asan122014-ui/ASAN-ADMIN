import { useEffect, useState } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  FileImage,
} from "lucide-react";

function DocumentModal({ image, onClose }) {
  const [zoom, setZoom] = useState(1);

  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () =>
      document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* ================= LOCK SCROLL ================= */

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ================= DOWNLOAD ================= */

  const downloadImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = "driver-document";
    link.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden"
      >

        {/* ================= HEADER ================= */}

        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-8 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3 text-white">

            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <FileImage size={22} />
            </div>

            <div>
              <h2 className="font-bold text-xl">
                Document Preview
              </h2>

              <p className="text-sm text-slate-300">
                Click outside or press ESC to close
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center"
          >
            <X size={22} />
          </button>

        </div>

        {/* ================= TOOLBAR ================= */}

        <div className="border-b bg-slate-50 px-6 py-4 flex items-center justify-between">

          <div className="text-sm text-slate-500">
            Zoom: {Math.round(zoom * 100)}%
          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                setZoom((prev) => Math.max(0.5, prev - 0.25))
              }
              className="p-3 rounded-xl bg-white border hover:bg-slate-100 transition"
            >
              <ZoomOut size={18} />
            </button>

            <button
              onClick={() =>
                setZoom((prev) => Math.min(3, prev + 0.25))
              }
              className="p-3 rounded-xl bg-white border hover:bg-slate-100 transition"
            >
              <ZoomIn size={18} />
            </button>

            <button
              onClick={downloadImage}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl transition"
            >
              <Download size={18} />
              Download
            </button>

          </div>

        </div>

        {/* ================= IMAGE AREA ================= */}

        <div className="bg-slate-100 h-[75vh] overflow-auto flex items-center justify-center p-10">
                    {image ? (
            <img
              src={image}
              alt="Driver Document"
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.25s ease",
              }}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500">

              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mb-5">
                <FileImage size={40} />
              </div>

              <h3 className="text-xl font-semibold">
                No Document Available
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                This driver has not uploaded a document.
              </p>

            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="bg-white border-t px-8 py-5 flex items-center justify-between">

          <div>
            <p className="font-semibold text-slate-700">
              Driver Verification Document
            </p>

            <p className="text-sm text-slate-500">
              Review the uploaded document before approving the driver.
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 shadow-lg"
          >
            Close Preview
          </button>

        </div>

      </div>
    </div>
  );
}

export default DocumentModal;