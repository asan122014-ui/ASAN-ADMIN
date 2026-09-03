import {
  useEffect,
  useState,
} from "react";

import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  FileImage,
  RotateCcw,
} from "lucide-react";

function DocumentModal({
  image,
  onClose,
}) {
  /* =========================================================
     STATE
  ========================================================= */

  const [
    zoom,
    setZoom,
  ] = useState(1);

  const [
    imageError,
    setImageError,
  ] = useState(false);

  /* =========================================================
     RESET WHEN IMAGE CHANGES
  ========================================================= */

  useEffect(() => {
    setZoom(1);
    setImageError(false);
  }, [image]);

  /* =========================================================
     ESC CLOSE
  ========================================================= */

  useEffect(() => {
    const handleEsc = (
      event
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, [onClose]);

  /* =========================================================
     LOCK BODY SCROLL
  ========================================================= */

  useEffect(() => {
    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  /* =========================================================
     ZOOM
  ========================================================= */

  const zoomOut = () => {
    setZoom(
      (current) =>
        Math.max(
          0.5,
          current - 0.25
        )
    );
  };

  const zoomIn = () => {
    setZoom(
      (current) =>
        Math.min(
          3,
          current + 0.25
        )
    );
  };

  const resetZoom = () => {
    setZoom(1);
  };

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const downloadImage = () => {
    if (!image) {
      return;
    }

    try {
      const link =
        document.createElement(
          "a"
        );

      link.href = image;

      link.download =
        "driver-document";

      link.target =
        "_blank";

      link.rel =
        "noopener noreferrer";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );
    } catch (error) {
      console.error(
        "Document download error:",
        error
      );

      window.open(
        image,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-3 sm:p-6"
      onClick={
        onClose
      }
    >
      <div
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
        className="bg-[#FFFDF8] border border-[#EED69B] rounded-3xl shadow-2xl w-full max-w-6xl max-h-[94vh] overflow-hidden flex flex-col"
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="bg-[#1C1917] px-5 sm:px-8 py-5 flex items-center justify-between gap-5">

          <div className="flex items-center gap-3 text-white min-w-0">

            <div className="w-11 h-11 rounded-xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center shrink-0">

              <FileImage
                size={22}
              />

            </div>

            <div className="min-w-0">

              <p className="text-xs font-bold tracking-[0.16em] text-[#FFD36A] mb-1">
                DRIVER VERIFICATION
              </p>

              <h2 className="font-black text-xl">
                Document Preview
              </h2>

              <p className="text-sm text-white/60">
                Review the uploaded document before taking action.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center shrink-0"
          >
            <X
              size={22}
            />
          </button>

        </div>

        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div className="border-b border-[#EEE4D5] bg-[#FFF9EE] px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <p className="text-xs font-semibold text-[#8C8276]">
              Zoom Level
            </p>

            <p className="font-black text-[#1C1917] mt-0.5">
              {Math.round(
                zoom * 100
              )}
              %
            </p>

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={
                zoomOut
              }
              disabled={
                zoom <= 0.5
              }
              className="w-11 h-11 rounded-xl bg-white border border-[#E4D8C8] hover:bg-[#F6F0E7] disabled:opacity-40 flex items-center justify-center transition"
              aria-label="Zoom out"
            >
              <ZoomOut
                size={18}
              />
            </button>

            <button
              type="button"
              onClick={
                resetZoom
              }
              disabled={
                zoom === 1
              }
              className="w-11 h-11 rounded-xl bg-white border border-[#E4D8C8] hover:bg-[#F6F0E7] disabled:opacity-40 flex items-center justify-center transition"
              aria-label="Reset zoom"
            >
              <RotateCcw
                size={18}
              />
            </button>

            <button
              type="button"
              onClick={
                zoomIn
              }
              disabled={
                zoom >= 3
              }
              className="w-11 h-11 rounded-xl bg-white border border-[#E4D8C8] hover:bg-[#F6F0E7] disabled:opacity-40 flex items-center justify-center transition"
              aria-label="Zoom in"
            >
              <ZoomIn
                size={18}
              />
            </button>

            <button
              type="button"
              onClick={
                downloadImage
              }
              disabled={
                !image
              }
              className="h-11 flex items-center gap-2 bg-[#FFB000] hover:bg-[#EFA500] disabled:opacity-50 text-[#1C1917] px-4 rounded-xl font-bold transition"
            >
              <Download
                size={17}
              />

              Download
            </button>

          </div>

        </div>

        {/* ===================================================
            IMAGE AREA
        =================================================== */}

        <div className="flex-1 min-h-[420px] max-h-[70vh] bg-[#EDE7DD] overflow-auto">

          {image &&
          !imageError ? (
            <div className="min-w-full min-h-full flex items-center justify-center p-8 sm:p-12">

              <img
                src={image}
                alt="Driver verification document"
                style={{
                  transform:
                    `scale(${zoom})`,

                  transition:
                    "transform 0.2s ease",
                }}
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl bg-white origin-center"
                onError={() =>
                  setImageError(
                    true
                  )
                }
              />

            </div>
          ) : (
            <div className="min-h-[420px] flex flex-col items-center justify-center text-center px-6">

              <div className="w-20 h-20 rounded-3xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center mb-5">

                <FileImage
                  size={34}
                  className="text-[#B87700]"
                />

              </div>

              <h3 className="text-xl font-black text-[#1C1917]">
                {imageError
                  ? "Unable to Load Document"
                  : "No Document Available"}
              </h3>

              <p className="mt-2 text-sm text-[#8C8276] max-w-md">
                {imageError
                  ? "The document URL could not be loaded. The file may have been moved, deleted, or is temporarily unavailable."
                  : "This driver has not uploaded a document for this field."}
              </p>

            </div>
          )}

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="bg-[#FFFDF8] border-t border-[#EEE4D5] px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <p className="font-black text-[#1C1917]">
              Driver Verification Document
            </p>

            <p className="text-sm text-[#8C8276] mt-1">
              Check document clarity and validity before approving the driver.
            </p>

          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="px-6 py-3 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold transition shrink-0"
          >
            Close Preview
          </button>

        </div>

      </div>
    </div>
  );
}

export default DocumentModal;