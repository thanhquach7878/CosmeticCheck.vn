import { useState, useEffect } from "react";
import { X, Trash2, Printer, Bookmark, ArrowRight, ShieldCheck, Calendar, Sparkles } from "lucide-react";
import { SavedProduct, getSavedProducts, removeSavedProduct } from "../utils/storage";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (text: string) => void;
}

export default function SavedProductsModal({ isOpen, onClose, onSelectProduct }: Props) {
  const [savedList, setSavedList] = useState<SavedProduct[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSavedList(getSavedProducts());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    const updated = removeSavedProduct(id);
    setSavedList(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D4A3E]/45 backdrop-blur-md"
    >
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1F2E27]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2D4A3E]/10 flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E]/10 flex items-center justify-center text-[#2D4A3E]">
              <Bookmark className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#2D4A3E]">
                Sản Phẩm Đã Lưu Đối Chiếu ({savedList.length})
              </h3>
              <p className="text-xs text-[#8F9E8B]">
                Lưu trữ an toàn trên thiết bị của bạn không cần đăng nhập
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedList.length > 0 && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#2D4A3E]/20 text-xs font-bold text-[#2D4A3E] hover:bg-[#FFFFFF] transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> In danh sách
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#8F9E8B] hover:text-[#2D4A3E] rounded-xl hover:bg-[#2D4A3E]/5 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {savedList.length === 0 ? (
            <div className="text-center py-8 text-[#8F9E8B] space-y-3">
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-[#2D4A3E]/15 shadow-sm bg-[#EAE6DE]">
                <img
                  src="/src/assets/images/aloe_serum_dropper_1790602951070.jpg"
                  alt="Lưu trữ bảng thành phần mỹ phẩm"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-bold text-[#2D4A3E] font-heading">Bạn chưa lưu bảng thành phần nào.</p>
              <p className="text-xs max-w-sm mx-auto text-[#405349]">
                Khi phân tích bất kỳ mỹ phẩm nào, hãy bấm nút <strong>"Lưu sản phẩm"</strong> để xem lại và đối chiếu nhanh khi mua sắm tại cửa hàng nhé!
              </p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#2D4A3E]/10 hover:border-[#2D4A3E]/30 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm text-[#2D4A3E]">{item.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D4A3E]/10 text-[#2D4A3E] font-bold">
                      {item.safetyScore}% An toàn
                    </span>
                    {item.pregnancySafe ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                        Mẹ bầu an tâm
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">
                        Tránh thai kỳ
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#405349] line-clamp-1 italic">
                    {item.rawText}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#8F9E8B]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                    <span>·</span>
                    <span>{item.ingredientsCount} thành phần</span>
                    <span>·</span>
                    <span className="text-[#2D4A3E]">{item.safeCount} lành tính</span>
                    {item.highRiskCount > 0 && (
                      <span className="text-rose-600 font-medium">{item.highRiskCount} cần lưu ý</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectProduct(item.rawText);
                      onClose();
                    }}
                    className="btn-primary-action px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 font-heading"
                  >
                    <span>Phân tích thành phần</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D4A3E]/10 bg-[#FFFFFF] flex justify-between items-center text-xs text-[#8F9E8B]">
          <span>Dữ liệu lưu trên trình duyệt của bạn (Local Storage).</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#EAE6DE] text-[#2D4A3E] font-bold hover:bg-[#dedad0] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
