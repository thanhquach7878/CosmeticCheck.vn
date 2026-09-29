import { X, Printer, ShieldCheck } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExecutiveSummaryModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D4A3E]/40 backdrop-blur-md"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1F2E27]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2D4A3E]/10 flex items-center justify-between bg-[#FFFFFF]">
          <div>
            <span className="text-[11px] font-semibold text-[#D4A373] uppercase tracking-wider">
              Tài Liệu Chiến Lược 2026
            </span>
            <h3 className="font-playfair text-xl font-bold text-[#2D4A3E]">
              Bản Tóm Tắt Kế Hoạch Kinh Doanh & Kiến Trúc Kỹ Thuật CosmeticCheck.vn
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2D4A3E] text-[#F7F5F0] rounded-xl text-xs font-semibold hover:bg-[#233a31] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> In / Lưu PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8F9E8B] hover:text-[#2D4A3E] rounded-xl hover:bg-[#2D4A3E]/5 transition-colors"
              aria-label="Đóng tóm tắt"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#405349] leading-relaxed font-sans bg-[#FFFFFF] m-4 rounded-2xl border border-[#2D4A3E]/10">
          {/* Visual Showcase Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-[#2D4A3E]/10 bg-[#EFECE6] aspect-[16/7]">
            <img
              src="https://placehold.co/1200x525/2D4A3E/F7F5F0?text=CosmeticCheck+Executive+Summary+2026"
              alt="Minh bạch thành phần và phục hồi chữa lành da CosmeticCheck"
              loading="lazy"
              className="w-full h-auto object-cover aspect-[16/7]"
              style={{ width: "100%", height: "auto", objectFit: "cover", aspectRatio: "16/7" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2E27]/90 via-[#1F2E27]/40 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[#D4A373] text-[10px] font-bold uppercase tracking-wider font-heading">
                Executive Briefing Document · 2026
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Minh Bạch Toàn Diện & Chữa Lành Làn Da Bằng AI
              </h3>
              <p className="text-xs text-slate-200 mt-1 max-w-xl hidden sm:block">
                Tiêu chuẩn hóa 45.000+ hoạt chất dược mỹ phẩm, an toàn tuyệt đối cho mẹ bầu và người có làn da nhạy cảm.
              </p>
            </div>
          </div>

          <div className="border-b border-[#2D4A3E]/10 pb-4">
            <h4 className="font-playfair text-lg font-bold text-[#2D4A3E] mb-1">
              1. Tầm nhìn & Sứ mệnh Dự án
            </h4>
            <p>
              CosmeticCheck.vn được xây dựng với mục tiêu trở thành nền tảng số 1 tại Việt Nam
              trong việc minh bạch hóa bảng thành phần mỹ phẩm bằng AI. Chúng tôi giải quyết tình trạng
              nhiễu loạn thông tin tiếp thị (cleanwashing, greenwashing) và bảo vệ sức khỏe làn da người
              tiêu dùng trước các nguy cơ kích ứng, mụn và chất độc hại.
            </p>
          </div>

          <div className="border-b border-[#2D4A3E]/10 pb-4">
            <h4 className="font-playfair text-lg font-bold text-[#2D4A3E] mb-1">
              2. Động lực Thị trường & Khách hàng Mục tiêu
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-[#405349]">
              <li>
                <strong>Đại chúng (8.4M người):</strong> Người có làn da nhạy cảm, dễ kích ứng cần
                tra cứu nhanh trước khi mua sắm.
              </li>
              <li>
                <strong>Ngách chuyên biệt:</strong> Mẹ bầu, phụ nữ cho con bú (tránh hoạt chất
                teratogen như Retinol, Hydroquinone, Salicylic Acid liều cao), người theo đuổi mỹ phẩm thuần chay (Vegan).
              </li>
              <li>
                <strong>Doanh nghiệp B2B:</strong> Phòng khám da liễu, Spa thẩm mỹ viện, nhà phân phối
                cần công cụ đối chiếu thành phần chính xác cho phác đồ điều trị.
              </li>
            </ul>
          </div>

          <div className="border-b border-[#2D4A3E]/10 pb-4">
            <h4 className="font-playfair text-lg font-bold text-[#2D4A3E] mb-1">
              3. Mô hình Doanh thu & Lộ trình Tài chính
            </h4>
            <p>
              Mô hình kinh doanh đa tầng kết hợp <strong>Freemium</strong> (thuê bao nâng cao
              79.000đ/tháng), <strong>Affiliate Marketing</strong> với các sàn TMĐT lớn (Shopee,
              Lazada, Guardian, Hasaki với hoa hồng 5-8%), và <strong>Báo cáo Xu hướng R&D B2B</strong>{" "}
              dành cho các nhãn hàng sản xuất hóa mỹ phẩm.
            </p>
          </div>

          <div className="border-b border-[#2D4A3E]/10 pb-4">
            <h4 className="font-playfair text-lg font-bold text-[#2D4A3E] mb-1">
              4. Hạ tầng Công nghệ & Bảo mật Zero Trust
            </h4>
            <p>
              Nền tảng vận hành trên stack công nghệ hiện đại: Frontend SSR Next.js/React kết hợp
              Tailwind CSS, Backend Node.js (Express), cơ sở dữ liệu quan hệ MySQL cho 45.000+ hoạt
              chất INCI. Tuân thủ toàn diện 15 bước kiểm soát kỹ thuật: Core Web Vitals (LCP &lt; 2.5s),
              TLS 1.3, AI-powered WAF chống cào dữ liệu, sao lưu tăng dần đa đám mây (NIST 800-34), và tuân
              thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
            </p>
          </div>

          <div>
            <h4 className="font-playfair text-lg font-bold text-[#2D4A3E] mb-1">
              5. Quản trị Rủi ro & Cam kết Triển khai
            </h4>
            <p>
              Mọi cảnh báo thành phần đều được bảo chứng bởi hội đồng bác sĩ da liễu và dược sĩ chuyên
              khoa. CosmeticCheck.vn cam kết khách quan 100%, không nhận tài trợ để làm sai lệch điểm số an
              toàn của bất kỳ thương hiệu nào.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D4A3E]/10 bg-[#FFFFFF] flex justify-between items-center text-xs text-[#8F9E8B]">
          <span>CosmeticCheck.vn &copy; 2026 · Confidential Executive Summary</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#EAE6DE] text-[#2D4A3E] font-semibold hover:bg-[#dedad0] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
