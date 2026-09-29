import { useState } from "react";
import { X, CheckCircle2, Filter, ShieldCheck } from "lucide-react";

export interface ChecklistItem {
  step: number;
  category: string;
  title: string;
  description: string;
  standard: string;
  status: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    step: 1,
    category: "Tốc độ",
    title: "Core Web Vitals Tối ưu (LCP < 2.5s)",
    description: "Đạt điểm PageSpeed 95-100 với hình ảnh AVIF/WebP, code-splitting và caching phân phối mượt mà.",
    standard: "Google Lighthouse & CrUX",
    status: "Đã xác minh"
  },
  {
    step: 2,
    category: "SEO & AI",
    title: "Cấu trúc Schema JSON-LD & RAG Compatibility",
    description: "Định dạng MedicalWebPage và Product Schema chuẩn hóa cho Google & Gemini AI crawler.",
    standard: "Schema.org / Semantic Web",
    status: "Đã xác minh"
  },
  {
    step: 3,
    category: "Bảo mật",
    title: "Kiến trúc Zero Trust & Container Cô Lập",
    description: "Mọi microservice đều được xác thực độc lập, không tin cậy ngầm định mạng nội bộ.",
    standard: "NIST SP 800-207",
    status: "Đã xác minh"
  },
  {
    step: 4,
    category: "Bảo mật",
    title: "Bắt buộc HTTPS & Mã hóa TLS 1.3",
    description: "Mã hóa toàn bộ kênh truyền tải với Perfect Forward Secrecy và HSTS Preload.",
    standard: "RFC 8446 / SSL Labs A+",
    status: "Đã xác minh"
  },
  {
    step: 5,
    category: "Bảo mật",
    title: "Xác thực Đa yếu tố (MFA) & RBAC",
    description: "Phân quyền quản trị viên chặt chẽ theo vai trò (Bác sĩ, Dược sĩ, Kỹ sư, Admin).",
    standard: "ISO/IEC 27001",
    status: "Đã xác minh"
  },
  {
    step: 6,
    category: "Bảo mật",
    title: "Tường lửa ứng dụng web AI-Powered WAF",
    description: "Chặn SQL Injection, XSS, rate-limiting chống cào dữ liệu tự động (Anti-Scraping).",
    standard: "OWASP Top 10",
    status: "Đã xác minh"
  },
  {
    step: 7,
    category: "Pháp lý",
    title: "Tuân thủ Nghị định 13/2023/NĐ-CP & GDPR",
    description: "Bảo vệ dữ liệu cá nhân, quyền được quên (Right to erasure) và Cookie Consent.",
    standard: "Pháp luật Việt Nam & EU",
    status: "Đã xác minh"
  },
  {
    step: 8,
    category: "Vận hành",
    title: "Sao lưu Tăng dần Off-site (Incremental Backup)",
    description: "Sao lưu định kỳ dữ liệu sang Cloud Storage mã hóa độc lập chống ransomware.",
    standard: "Quy tắc sao lưu 3-2-1",
    status: "Đã xác minh"
  },
  {
    step: 9,
    category: "Vận hành",
    title: "Hệ thống Giám sát & Báo động Tức thì 5xx",
    description: "Tích hợp webhook cảnh báo Telegram và PagerDuty khi tỷ lệ lỗi vượt ngưỡng 0.1%.",
    standard: "SRE SLA 99.95%",
    status: "Đã xác minh"
  },
  {
    step: 10,
    category: "Tốc độ",
    title: "Sẵn sàng PWA (Progressive Web App)",
    description: "Service Worker cache bảng tra cứu thành phần offline khi mất kết nối mạng.",
    standard: "W3C PWA Specs",
    status: "Đã xác minh"
  },
  {
    step: 11,
    category: "Tốc độ",
    title: "Content Delivery Network (CDN Multi-Edge)",
    description: "Phân phối asset tĩnh qua các PoP tại Hà Nội, Đà Nẵng và TP. Hồ Chí Minh.",
    standard: "Latency < 25ms",
    status: "Đã xác minh"
  },
  {
    step: 12,
    category: "SEO & AI",
    title: "Sitemap Tự động & Canonical Links",
    description: "Tự động cập nhật URL 45,000+ sản phẩm và ngăn ngừa nội dung trùng lặp.",
    standard: "Google Search Central",
    status: "Đã xác minh"
  },
  {
    step: 13,
    category: "Bảo mật",
    title: "Chính sách Bảo mật Nội dung (CSP) Ngặt nghèo",
    description: "Ngăn chặn chèn script độc hại từ bên thứ ba và clickjacking.",
    standard: "CSP Level 3",
    status: "Đã xác minh"
  },
  {
    step: 14,
    category: "Bảo mật",
    title: "Kiểm thử Xâm nhập Định kỳ (Penetration Testing)",
    description: "Đánh giá an ninh mạng định kỳ 6 tháng một lần bởi đơn vị độc lập.",
    standard: "CREST / SANS Top 25",
    status: "Đã xác minh"
  },
  {
    step: 15,
    category: "Vận hành",
    title: "Kế hoạch Phục hồi Thảm họa (DR Runbook)",
    description: "RTO < 30 phút, RPO < 5 phút với quy trình chuyển đổi dự phòng nóng.",
    standard: "NIST SP 800-34 Rev. 1",
    status: "Đã xác minh"
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChecklistModal({ isOpen, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");

  if (!isOpen) return null;

  const categories = ["Tất cả", "Tốc độ", "SEO & AI", "Bảo mật", "Pháp lý", "Vận hành"];

  const filteredItems =
    activeCategory === "Tất cả"
      ? CHECKLIST_ITEMS
      : CHECKLIST_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D4A3E]/40 backdrop-blur-md"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1F2E27]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2D4A3E]/10 flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#2D4A3E]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#2D4A3E]">
                15 BƯỚC RÀ SOÁT KỸ THUẬT & VẬN HÀNH 2026
              </h3>
              <p className="text-xs text-[#8F9E8B]">
                Tuân thủ Zero Trust, Core Web Vitals, NIST SP 800 và Nghị định 13/2023/NĐ-CP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8F9E8B] hover:text-[#2D4A3E] rounded-xl hover:bg-[#2D4A3E]/5 transition-colors"
            aria-label="Đóng bảng kiểm tra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-[#2D4A3E]/10 bg-[#FFFFFF] flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#8F9E8B] shrink-0" />
          <span className="text-xs text-[#405349] mr-2 shrink-0 font-medium">Lọc theo nhóm:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-[#2D4A3E] text-[#F7F5F0]"
                  : "bg-[#F7F5F0] text-[#405349] hover:bg-[#EAE6DE]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Visual Header Banner for Technical Reliability */}
          <div className="relative rounded-2xl overflow-hidden border border-[#2D4A3E]/10 h-36 bg-[#EAE6DE]">
            <img
              src="/src/assets/images/zerotrust_cloud_security_1790626393645.jpg"
              alt="Hạ tầng kỹ thuật đám mây, độ tin cậy SRE và bảo mật Zero Trust"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E27]/90 via-[#1F2E27]/40 to-transparent flex items-end p-4 text-white justify-between">
              <div>
                <span className="text-[#D4A373] text-[10px] font-bold uppercase tracking-wider font-heading block">
                  Tiêu Chuẩn Kỹ Thuật Độc Lập 2026
                </span>
                <span className="text-sm font-bold font-heading">
                  15/15 Hạng Mục Đạt Xác Thực Cao Nhất
                </span>
              </div>
              <span className="bg-[#2D4A3E]/90 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                SRE SLA 99.95%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredItems.map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#2D4A3E]/10 hover:border-[#2D4A3E]/30 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-[#2D4A3E]/10 text-[#2D4A3E] font-bold">
                      Bước {item.step.toString().padStart(2, "0")} · {item.category}
                    </span>
                    <span className="text-[11px] text-[#2D4A3E] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4A3E]" /> {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1F2E27] mb-1.5">{item.title}</h4>
                  <p className="text-xs text-[#405349] leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#2D4A3E]/5 text-[11px] text-[#8F9E8B]">
                  Tiêu chuẩn: {item.standard}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D4A3E]/10 bg-[#FFFFFF] flex justify-between items-center text-xs text-[#8F9E8B]">
          <span>Cam kết 100% tiêu chí kỹ thuật đã đưa vào tài liệu kiến trúc.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2D4A3E] text-[#F7F5F0] font-semibold hover:bg-[#233a31] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
