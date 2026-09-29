import { useState, useId, useEffect } from "react";
import {
  X,
  Search,
  Sparkles,
  Baby,
  Info,
  Leaf,
  Filter,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Printer,
  Bookmark,
  Check,
  Share2,
  CheckCircle2,
  Download,
  FileText,
  Loader2
} from "lucide-react";
import {
  PRESET_PRODUCTS,
  INGREDIENT_DICTIONARY,
  analyzeUnknownIngredient,
  Ingredient
} from "../data/cosmeticsData";
import { saveProduct } from "../utils/storage";
import { generateAnalysisPDF } from "../utils/pdfExport";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onOpenSavedModal?: () => void;
  syncText?: string;
  onSyncTextChange?: (text: string) => void;
}

export default function IngredientAnalyzerModal({
  isOpen,
  onClose,
  initialQuery,
  onOpenSavedModal,
  syncText,
  onSyncTextChange
}: Props) {
  const [activeTab, setActiveTab] = useState<"full_product" | "dictionary">("full_product");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("janssen-botanical-serum");
  const [productName, setProductName] = useState<string>("Sản phẩm phân tích");
  const [customText, setCustomText] = useState<string>(
    syncText !== undefined
      ? syncText
      : initialQuery && initialQuery.trim()
      ? initialQuery
      : PRESET_PRODUCTS[0].ingredientsText
  );
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);

  // Synchronize when external syncText or initialQuery changes
  useEffect(() => {
    if (syncText !== undefined && syncText !== customText) {
      setCustomText(syncText);
    }
  }, [syncText]);

  if (!isOpen) return null;

  const handleTextareaChange = (newVal: string) => {
    setCustomText(newVal);
    setSelectedPresetId("custom");
    if (onSyncTextChange) {
      onSyncTextChange(newVal);
    }
  };

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const found = PRESET_PRODUCTS.find((p) => p.id === id);
    if (found) {
      setProductName(found.name);
      setCustomText(found.ingredientsText);
      if (onSyncTextChange) {
        onSyncTextChange(found.ingredientsText);
      }
    }
  };

  const handleClearText = () => {
    setCustomText("");
    setSelectedPresetId("custom");
    if (onSyncTextChange) {
      onSyncTextChange("");
    }
  };

  // 1. INCI Parser: Split by commas, semicolons, newlines, bullets
  const rawIngredients = customText
    .split(/[,;\n•]+/)
    .map((s) => s.trim().replace(/^[\d\.\-\s]+/, "")) // Remove leading numbers/bullets
    .filter(Boolean);

  const parsedIngredients: {
    raw: string;
    info: Ingredient;
  }[] = rawIngredients.map((raw) => {
    const cleanKey = raw.toLowerCase().replace(/[\(\)]/g, "").trim();
    const matchKey = Object.keys(INGREDIENT_DICTIONARY).find(
      (k) => cleanKey === k || cleanKey.includes(k) || k.includes(cleanKey)
    );
    const info = matchKey ? INGREDIENT_DICTIONARY[matchKey] : analyzeUnknownIngredient(raw);
    return { raw, info };
  });

  // Calculate scores & metrics
  let totalScore = 0;
  let pregnancySafe = true;
  let maxComedogenic = 0;
  let maxIrritancy = 0;
  let highRiskCount = 0; // EWG 7-10 (Red)
  let cautionCount = 0;  // EWG 3-6 (Yellow)
  let safeCount = 0;     // EWG 1-2 (Green)
  let externalCount = 0;

  parsedIngredients.forEach(({ info }) => {
    const pts = 11 - info.ewgScore;
    totalScore += pts;
    if (!info.pregnancySafe) pregnancySafe = false;
    if (info.comedogenic > maxComedogenic) maxComedogenic = info.comedogenic;
    if (info.irritancy > maxIrritancy) maxIrritancy = info.irritancy;

    if (info.ewgScore >= 7) {
      highRiskCount++;
    } else if (info.ewgScore >= 3) {
      cautionCount++;
    } else {
      safeCount++;
    }

    if (info.source === "EXTENDED_AI") externalCount++;
  });

  const finalScore =
    parsedIngredients.length > 0
      ? Math.max(15, Math.min(99, Math.round((totalScore / (parsedIngredients.length * 10)) * 100)))
      : 0;

  // Handle Save to LocalStorage
  const handleSaveProduct = () => {
    saveProduct({
      name: productName || "Mỹ phẩm phân tích",
      rawText: customText,
      ingredientsCount: parsedIngredients.length,
      safetyScore: finalScore,
      safeCount,
      cautionCount,
      highRiskCount,
      pregnancySafe
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle Export to PDF Report
  const handleExportPDF = async () => {
    if (parsedIngredients.length === 0 || isExportingPdf) return;
    try {
      setIsExportingPdf(true);
      await generateAnalysisPDF({
        productName: productName.trim() || "Sản phẩm phân tích",
        totalScore: finalScore,
        pregnancySafe,
        maxComedogenic,
        maxIrritancy,
        safeCount,
        cautionCount,
        highRiskCount,
        ingredients: parsedIngredients,
        externalCount,
        rawText: customText
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error("Error generating PDF:", err);
      // Fallback to native print dialog
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter dictionary items for quick lookup
  const allDictionaryList = Object.values(INGREDIENT_DICTIONARY);
  const filteredDictionary = allDictionaryList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vietnameseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.folia && item.folia.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "Tất cả",
    "Thảo mộc",
    "Dưỡng ẩm",
    "Phục hồi",
    "Chống lão hóa",
    "Trị mụn",
    "Làm sáng",
    "Chống nắng",
    "Chất làm mềm"
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2D4A3E]/50 backdrop-blur-md"
    >
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1F2E27]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2D4A3E]/10 flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#2D4A3E]" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2D4A3E]">
                Bảng Phân Tích Thành Phần Mỹ Phẩm (INCI Parser)
              </h3>
              <p className="text-xs text-[#8F9E8B]">
                Tiêu chuẩn EWG Skin Deep 2026 & Encyclopedia of Ingredients (Janssen PDF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Save, PDF Export & Print Controls */}
            {parsedIngredients.length > 0 && activeTab === "full_product" && (
              <>
                <button
                  onClick={handleSaveProduct}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    savedSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-[#FFFFFF] border border-[#2D4A3E]/20 text-[#2D4A3E] hover:bg-[#F7F5F0]"
                  }`}
                  title="Lưu vào bộ nhớ trình duyệt"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Đã lưu!
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-[#D4A373]" /> Lưu
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={isExportingPdf}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    pdfSuccess
                      ? "bg-emerald-700 text-white border border-emerald-700"
                      : isExportingPdf
                      ? "bg-[#2D4A3E]/10 text-[#2D4A3E] border border-[#2D4A3E]/30 cursor-wait"
                      : "bg-[#2D4A3E] text-[#F7F5F0] border border-[#2D4A3E] hover:bg-[#233a31]"
                  }`}
                  title="Tải báo cáo phân tích thành phần dưới dạng file PDF"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="hidden sm:inline">Đang tạo PDF...</span>
                      <span className="sm:hidden">PDF...</span>
                    </>
                  ) : pdfSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span className="hidden sm:inline">Đã tải PDF!</span>
                      <span className="sm:hidden">Đã tải</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span className="hidden sm:inline">Xuất Báo Cáo PDF</span>
                      <span className="sm:hidden">Xuất PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2D4A3E]/20 text-xs font-bold text-[#2D4A3E] hover:bg-[#FFFFFF] transition-all"
                  title="In bản phân tích"
                >
                  <Printer className="w-3.5 h-3.5" /> In
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 text-[#8F9E8B] hover:text-[#2D4A3E] rounded-xl hover:bg-[#2D4A3E]/5 transition-colors"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-[#F1EFEA] border-b border-[#2D4A3E]/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("full_product")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "full_product"
                  ? "bg-[#2D4A3E] text-[#F7F5F0] shadow-sm"
                  : "text-[#405349] hover:bg-white/60"
              }`}
            >
              Phân tích nguyên bảng thành phần (INCI)
            </button>
            <button
              onClick={() => setActiveTab("dictionary")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "dictionary"
                  ? "bg-[#2D4A3E] text-[#F7F5F0] shadow-sm"
                  : "text-[#405349] hover:bg-white/60"
              }`}
            >
              Tra cứu Encyclopedia PDF ({allDictionaryList.length}+ chất)
            </button>
          </div>

          {onOpenSavedModal && (
            <button
              onClick={onOpenSavedModal}
              className="text-xs text-[#2D4A3E] hover:text-[#D4A373] font-bold flex items-center gap-1 py-1"
            >
              <Bookmark className="w-3.5 h-3.5" /> Xem các sản phẩm đã lưu &rarr;
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === "full_product" ? (
            <>
              {/* Presets Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#405349] mb-2 font-heading">
                  Chọn công thức điển hình (hoặc dán bảng thành phần của bạn):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {PRESET_PRODUCTS.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelectPreset(prod.id)}
                      className={`text-left p-3 rounded-2xl border text-xs transition-all ${
                        selectedPresetId === prod.id
                          ? "border-[#2D4A3E] bg-[#FFFFFF] shadow-sm ring-1 ring-[#2D4A3E]"
                          : "border-[#2D4A3E]/10 bg-[#FFFFFF]/70 hover:bg-[#FFFFFF]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#2D4A3E] truncate font-heading">{prod.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8F9E8B]/20 text-[#2D4A3E] font-medium shrink-0">
                          {prod.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#405349] line-clamp-1">{prod.tagline}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Large Textarea for Copy-Pasting Full Ingredient List */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#2D4A3E]/10 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2D4A3E] flex items-center gap-1.5 font-heading">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" /> Dán nguyên bảng thành phần (phân tách bởi dấu phẩy ,):
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Đồng bộ 2 chiều với SearchBar
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Tên sản phẩm (tùy chọn)"
                      className="text-xs bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-lg px-2.5 py-1 text-[#1F2E27] focus:outline-none focus:border-[#2D4A3E]"
                    />
                    <button
                      onClick={handleClearText}
                      className="text-xs text-[#D4A373] hover:underline font-bold shrink-0"
                    >
                      Xóa văn bản
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={customText}
                  onChange={(e) => handleTextareaChange(e.target.value)}
                  placeholder="Ví dụ: Water, Glycerin, Niacinamide, Centella Asiatica Extract, Salicylic Acid, Phenoxyethanol, Fragrance..."
                  className="w-full bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-xl p-3.5 text-xs sm:text-sm text-[#1F2E27] placeholder-[#8F9E8B] focus:outline-none focus:border-[#2D4A3E] transition-colors leading-relaxed font-sans"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="text-[11px] text-[#8F9E8B]">
                    Hệ thống tự động cắt chuỗi theo dấu phẩy <code>,</code>, chấm phẩy <code>;</code> và tính điểm toàn bộ cùng lúc.
                  </div>
                  <button
                    onClick={() => {
                      // Trigger parse refresh
                    }}
                    className="px-5 py-2.5 bg-[#2D4A3E] text-[#F7F5F0] rounded-xl text-xs font-bold hover:bg-[#233a31] transition-all shadow-glow-primary flex items-center gap-1.5 font-heading"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Phân tích thành phần</span>
                  </button>
                </div>
              </div>

              {/* 2. EWG Rating Bar & Scorecard */}
              {parsedIngredients.length > 0 && (
                <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#2D4A3E]/10 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-heading font-extrabold text-[#2D4A3E] tabular-nums">
                        {finalScore}%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D4A3E] font-heading">Độ Lành Tính</p>
                        <p className="text-[11px] text-[#8F9E8B]">
                          {finalScore >= 80 ? "Rất an toàn" : finalScore >= 60 ? "Trung bình" : "Cần thận trọng"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          pregnancySafe ? "bg-[#2D4A3E]/10 text-[#2D4A3E]" : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        <Baby className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D4A3E] font-heading">Thai Kỳ</p>
                        <p className="text-[11px] text-[#8F9E8B]">
                          {pregnancySafe ? "Mẹ bầu an tâm" : "Chống chỉ định"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-[#D4A373] tabular-nums font-heading">
                        {maxComedogenic}/5
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D4A3E] font-heading">Bít Tắc Chân Lông</p>
                        <p className="text-[11px] text-[#8F9E8B]">
                          {maxComedogenic <= 1 ? "Nguy cơ rất thấp" : "Dễ sinh mụn ẩn"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-[#405349] tabular-nums font-heading">
                        {maxIrritancy}/5
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D4A3E] font-heading">Mức Kích Ứng</p>
                        <p className="text-[11px] text-[#8F9E8B]">
                          {maxIrritancy <= 1 ? "Êm dịu da nhạy cảm" : "Nên test quai hàm"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Visual EWG Spectrum Progress Bar */}
                  <div className="pt-2 border-t border-[#2D4A3E]/10 space-y-1.5">
                    <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                      <span className="font-bold text-[#2D4A3E] font-heading">
                        Thước đo an toàn & Cảnh báo kích ứng EWG Skin Deep ({parsedIngredients.length} chất):
                      </span>
                      <div className="flex items-center gap-3 text-[11px] flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                          Xanh lá (Mức 1-2): {safeCount} An toàn, lành tính
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-amber-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          Vàng (Mức 3-6): {cautionCount} Lưu ý theo nồng độ
                        </span>
                        {highRiskCount > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-rose-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                            Đỏ (Mức 7-10): {highRiskCount} Dễ kích ứng / Cồn / Hương liệu
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${(safeCount / parsedIngredients.length) * 100}%` }}
                        className="bg-emerald-600 h-full transition-all"
                        title={`An toàn, lành tính (EWG 1-2): ${safeCount}`}
                      />
                      <div
                        style={{ width: `${(cautionCount / parsedIngredients.length) * 100}%` }}
                        className="bg-amber-500 h-full transition-all"
                        title={`Cần lưu ý theo nồng độ (EWG 3-6): ${cautionCount}`}
                      />
                      <div
                        style={{ width: `${(highRiskCount / parsedIngredients.length) * 100}%` }}
                        className="bg-rose-600 h-full transition-all"
                        title={`Dễ kích ứng / Cồn khô / Hương liệu (EWG 7-10): ${highRiskCount}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Extended Analysis Notification if External Ingredients Detected */}
              {externalCount > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#D4A373]/15 border border-[#D4A373]/30 text-xs text-[#1F2E27] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#B87D43] shrink-0" />
                    <span>
                      Đã phát hiện <strong>{externalCount} hoạt chất bên ngoài</strong> danh mục gốc. Hệ thống đã kích hoạt <strong>Khung phân tích mở rộng</strong> tự động thẩm định hóa học.
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-[#FFFFFF] text-[#B87D43] font-bold text-[10px] shrink-0 font-heading">
                    Khung mở rộng AI
                  </span>
                </div>
              )}

              {/* PDF Report Export Banner Card */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#2D4A3E]/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#2D4A3E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-[#2D4A3E]">
                        Xuất Hồ Sơ Thẩm Định Mỹ Phẩm (PDF)
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A373]/20 text-[#B87D43] font-bold">
                        Chuẩn Y Khoa A4
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7C72] mt-0.5">
                      Đầy đủ thước đo EWG 2026, chống chỉ định thai kỳ, bít tắc chân lông & bảng kê hoạt chất chi tiết.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleExportPDF}
                  disabled={isExportingPdf}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 font-heading shrink-0 shadow-sm ${
                    pdfSuccess
                      ? "bg-emerald-700 text-white"
                      : isExportingPdf
                      ? "bg-[#2D4A3E]/15 text-[#2D4A3E] cursor-wait"
                      : "bg-[#2D4A3E] text-[#F7F5F0] hover:bg-[#233a31] shadow-glow-primary"
                  }`}
                  title="Tải báo cáo phân tích thành phần mỹ phẩm định dạng PDF"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang kết xuất PDF...</span>
                    </>
                  ) : pdfSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã tải xuống thành công!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-[#D4A373]" />
                      <span>Tải Báo Cáo PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2. Detailed Color-Coded Table of All Parsed Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D4A3E] font-heading">
                    Danh sách đánh giá chi tiết {parsedIngredients.length} thành phần:
                  </h4>
                  <span className="text-xs text-[#8F9E8B]">Sắp xếp theo thứ tự xuất hiện trên nhãn</span>
                </div>

                <div className="bg-[#FFFFFF] border border-[#2D4A3E]/10 rounded-2xl overflow-hidden divide-y divide-[#2D4A3E]/5 shadow-sm">
                  {parsedIngredients.map((item, idx) => {
                    const info = item.info;
                    const isExternal = info.source === "EXTENDED_AI";
                    const ewg = info.ewgScore;

                    // Exact Color Coding rule:
                    // Green: 1-2
                    // Yellow: 3-6
                    // Red: 7-10
                    let ewgStyle = "bg-emerald-100 text-emerald-800 border-emerald-300";
                    let ewgLabel = "An toàn, lành tính";
                    if (ewg >= 7) {
                      ewgStyle = "bg-rose-100 text-rose-800 border-rose-300 font-bold";
                      ewgLabel = "Dễ kích ứng / Cồn khô / Hương liệu";
                    } else if (ewg >= 3) {
                      ewgStyle = "bg-amber-100 text-amber-800 border-amber-300";
                      ewgLabel = "Cần lưu ý theo nồng độ";
                    }

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                          ewg >= 7
                            ? "bg-rose-50/40 hover:bg-rose-50/70"
                            : isExternal
                            ? "bg-[#FAF7F2] hover:bg-[#F3EFE7]"
                            : "hover:bg-[#F7F5F0]/60"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#1F2E27] font-heading">
                              {idx + 1}. {info.name}
                            </span>
                            <span className="text-[#8F9E8B]">({info.vietnameseName})</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8F9E8B]/15 text-[#405349] font-medium">
                              {info.category}
                            </span>
                            {info.folia && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D4A3E]/10 text-[#2D4A3E] font-bold font-mono">
                                {info.folia}
                              </span>
                            )}
                            {isExternal && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A373]/20 text-[#B87D43] font-bold">
                                Khung mở rộng
                              </span>
                            )}
                          </div>
                          <p className="text-[#405349] leading-relaxed">
                            {info.function} · {info.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold tabular-nums ${ewgStyle}`}>
                              EWG: {info.ewgScore}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-0.5">{ewgLabel}</p>
                          </div>

                          {!info.pregnancySafe && (
                            <span className="text-rose-700 text-[11px] font-bold flex items-center gap-1 bg-rose-100 px-2 py-1 rounded-lg border border-rose-300">
                              <AlertTriangle className="w-3.5 h-3.5" /> Tránh thai kỳ
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Encyclopedia Dictionary Search Tab */
            <div className="space-y-4">
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#2D4A3E]/10 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#8F9E8B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên hoặc số Folia (vd: Acerola, Folia 06, Allantoin, Avocado peptide...)"
                    className="w-full bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1F2E27] placeholder-[#8F9E8B] focus:outline-none focus:border-[#2D4A3E]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#8F9E8B] shrink-0 mr-1" />
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl whitespace-nowrap font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#2D4A3E] text-[#F7F5F0] font-bold"
                          : "bg-[#F7F5F0] text-[#405349] hover:bg-[#EAE6DE]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDictionary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#2D4A3E]/10 shadow-sm flex flex-col justify-between space-y-2 hover:border-[#2D4A3E]/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="font-bold text-sm text-[#2D4A3E] font-heading">{item.name}</h5>
                        <div className="flex items-center gap-1.5">
                          {item.folia && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#2D4A3E]/10 text-[#2D4A3E] font-mono">
                              {item.folia}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                              item.ewgScore <= 2
                                ? "bg-emerald-100 text-emerald-800"
                                : item.ewgScore <= 6
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            EWG {item.ewgScore}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#D4A373] font-semibold mb-1.5 font-heading">
                        {item.vietnameseName} · {item.category}
                      </p>
                      <p className="text-xs text-[#405349] leading-relaxed">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#2D4A3E]/5 flex items-center justify-between text-[11px] text-[#8F9E8B]">
                      <span>Bít tắc: {item.comedogenic}/5</span>
                      <span>Kích ứng: {item.irritancy}/5</span>
                      <span className={item.pregnancySafe ? "text-[#2D4A3E] font-bold" : "text-rose-600 font-bold"}>
                        {item.pregnancySafe ? "An toàn thai kỳ" : "Chống chỉ định"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D4A3E]/10 bg-[#FFFFFF] flex flex-wrap justify-between items-center gap-3 text-xs text-[#8F9E8B]">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#2D4A3E]" />
            <span>Encyclopedia of Ingredients (Janssen Cosmetics) & Khung phân tích mở rộng AI.</span>
          </div>

          <div className="flex items-center gap-2">
            {parsedIngredients.length > 0 && activeTab === "full_product" && (
              <>
                <button
                  onClick={handleSaveProduct}
                  className="px-4 py-2 bg-[#FFFFFF] border border-[#2D4A3E]/20 text-[#2D4A3E] rounded-xl font-bold hover:bg-[#F7F5F0] transition-all flex items-center gap-1.5 font-heading"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{savedSuccess ? "Đã lưu!" : "Lưu kết quả"}</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={isExportingPdf}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-heading shadow-glow-primary ${
                    pdfSuccess
                      ? "bg-emerald-700 text-white"
                      : isExportingPdf
                      ? "bg-[#2D4A3E]/20 text-[#2D4A3E] cursor-wait"
                      : "bg-[#2D4A3E] text-[#F7F5F0] hover:bg-[#233a31]"
                  }`}
                  title="Xuất file PDF phân tích chi tiết"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tạo PDF...</span>
                    </>
                  ) : pdfSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã tải PDF!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>Xuất Báo Cáo PDF</span>
                    </>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setActiveTab("full_product");
              }}
              className="px-5 py-2 rounded-xl bg-[#2D4A3E] text-[#F7F5F0] font-bold hover:bg-[#233a31] transition-colors font-heading"
            >
              Phân tích thành phần
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
