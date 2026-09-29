import React from "react";

export default function InciDashboardMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden shadow-lg border border-[#2D4A3E]/15 bg-[#F7F5F0] relative"
      style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
    >
      <svg
        viewBox="0 0 800 450"
        className="w-full h-auto block select-none"
        style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
        role="img"
        aria-label="Khung Mockup ứng dụng CosmeticCheck INCI Parser chuẩn WCAG 2.1 AA trực quan dễ đọc"
      >
        {/* Background Canvas */}
        <rect width="800" height="450" fill="#F7F5F0" />

        {/* Window Top Bar */}
        <rect width="800" height="40" fill="#2D4A3E" />
        <circle cx="24" cy="20" r="5" fill="#E26D5C" />
        <circle cx="40" cy="20" r="5" fill="#E8B042" />
        <circle cx="56" cy="20" r="5" fill="#48BB78" />

        <text
          x="76"
          y="24"
          fill="#F7F5F0"
          fontFamily="Montserrat, sans-serif"
          fontSize="12"
          fontWeight="bold"
        >
          CosmeticCheck.vn · INCI Safety Parser & Clinical Checker
        </text>

        {/* Top Bar Badges */}
        <rect x="580" y="11" width="95" height="18" rx="9" fill="#1F2E27" />
        <text
          x="627"
          y="23"
          textAnchor="middle"
          fill="#D4A373"
          fontFamily="sans-serif"
          fontSize="9"
          fontWeight="bold"
        >
          WCAG 2.1 AAA
        </text>

        <rect x="685" y="11" width="95" height="18" rx="9" fill="#D4A373" />
        <text
          x="732"
          y="23"
          textAnchor="middle"
          fill="#1F2E27"
          fontFamily="sans-serif"
          fontSize="9"
          fontWeight="bold"
        >
          EWG 2026 Ready
        </text>

        {/* Main Application Workspace */}
        {/* Left Column: Input and Ingredients List */}
        <rect x="20" y="55" width="460" height="375" rx="14" fill="#FFFFFF" stroke="#2D4A3E" strokeOpacity="0.12" strokeWidth="1" />
        
        {/* App Workspace Header */}
        <rect x="36" y="70" width="428" height="38" rx="8" fill="#F7F5F0" stroke="#2D4A3E" strokeOpacity="0.08" />
        <text x="50" y="93" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600">
          Công thức: Nước, Acerola extract, Avocado peptide, Allantoin, Niacinamide...
        </text>
        <rect x="390" y="76" width="66" height="26" rx="6" fill="#2D4A3E" />
        <text x="423" y="93" textAnchor="middle" fill="#FFFFFF" fontFamily="Montserrat, sans-serif" fontSize="10" fontWeight="bold">
          Đã quét
        </text>

        {/* Section title */}
        <text x="36" y="130" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="12" fontWeight="bold">
          Thành phần bóc tách từ nhãn chai (45.000+ INCI Database)
        </text>

        {/* Ingredient Row 1: Acerola */}
        <rect x="36" y="145" width="428" height="52" rx="8" fill="#FBFBF9" stroke="#E2E8F0" />
        <circle cx="56" cy="171" r="12" fill="#E8F5E9" />
        <text x="56" y="175" textAnchor="middle" fill="#2E7D32" fontSize="11" fontWeight="bold">1</text>
        <text x="78" y="165" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold">
          Acerola (malpighia punicifolia) extract
        </text>
        <text x="78" y="182" fill="#8F9E8B" fontFamily="sans-serif" fontSize="9">
          Vitamin C hữu cơ · Chống oxy hóa tế bào · EWG Điểm 1 (Tuyệt đối an toàn)
        </text>
        <rect x="382" y="160" width="72" height="22" rx="11" fill="#E8F5E9" />
        <text x="418" y="175" textAnchor="middle" fill="#2E7D32" fontFamily="sans-serif" fontSize="9" fontWeight="bold">
          Lành tính
        </text>

        {/* Ingredient Row 2: Avocado peptide */}
        <rect x="36" y="205" width="428" height="52" rx="8" fill="#FBFBF9" stroke="#E2E8F0" />
        <circle cx="56" cy="231" r="12" fill="#E8F5E9" />
        <text x="56" y="235" textAnchor="middle" fill="#2E7D32" fontSize="11" fontWeight="bold">1</text>
        <text x="78" y="225" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold">
          Avocado peptide (Peptide trái bơ)
        </text>
        <text x="78" y="242" fill="#8F9E8B" fontFamily="sans-serif" fontSize="9">
          Dưỡng ẩm lipid màng biểu bì · Thúc đẩy collagen · Chuẩn Janssen
        </text>
        <rect x="382" y="220" width="72" height="22" rx="11" fill="#E8F5E9" />
        <text x="418" y="235" textAnchor="middle" fill="#2E7D32" fontFamily="sans-serif" fontSize="9" fontWeight="bold">
          Thuần chay
        </text>

        {/* Ingredient Row 3: Allantoin */}
        <rect x="36" y="265" width="428" height="52" rx="8" fill="#FBFBF9" stroke="#E2E8F0" />
        <circle cx="56" cy="291" r="12" fill="#E8F5E9" />
        <text x="56" y="295" textAnchor="middle" fill="#2E7D32" fontSize="11" fontWeight="bold">1</text>
        <text x="78" y="285" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold">
          Allantoin (Chiết xuất hoa chuông)
        </text>
        <text x="78" y="302" fill="#8F9E8B" fontFamily="sans-serif" fontSize="9">
          Phục hồi biểu bì tổn thương · Làm dịu kích ứng tức thì · An toàn thai kỳ
        </text>
        <rect x="382" y="280" width="72" height="22" rx="11" fill="#FEF3C7" />
        <text x="418" y="295" textAnchor="middle" fill="#B45309" fontFamily="sans-serif" fontSize="9" fontWeight="bold">
          Mẹ bầu an tâm
        </text>

        {/* Ingredient Row 4: Niacinamide */}
        <rect x="36" y="325" width="428" height="52" rx="8" fill="#FBFBF9" stroke="#E2E8F0" />
        <circle cx="56" cy="351" r="12" fill="#E8F5E9" />
        <text x="56" y="355" textAnchor="middle" fill="#2E7D32" fontSize="11" fontWeight="bold">1</text>
        <text x="78" y="345" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold">
          Niacinamide (Vitamin B3)
        </text>
        <text x="78" y="362" fill="#8F9E8B" fontFamily="sans-serif" fontSize="9">
          Củng cố hàng rào ceramide · Kiểm soát bã nhờn · Kháng viêm nhẹ
        </text>
        <rect x="382" y="340" width="72" height="22" rx="11" fill="#E8F5E9" />
        <text x="418" y="355" textAnchor="middle" fill="#2E7D32" fontFamily="sans-serif" fontSize="9" fontWeight="bold">
          Lành tính
        </text>

        {/* Bottom Tagline */}
        <rect x="36" y="388" width="428" height="28" rx="6" fill="#F7F5F0" />
        <text x="48" y="406" fill="#405349" fontFamily="sans-serif" fontSize="9">
          ✔ 0 chất cấm · 0 Paraben · 0 Hương liệu nhân tạo · 0 Cồn khô rủi ro
        </text>

        {/* Right Column: Score & Visual Gauges */}
        <rect x="496" y="55" width="284" height="375" rx="14" fill="#FFFFFF" stroke="#2D4A3E" strokeOpacity="0.12" strokeWidth="1" />
        
        {/* Score Ring Card */}
        <text x="516" y="82" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="12" fontWeight="bold">
          Điểm An Toàn Tổng Thể
        </text>
        
        {/* Score Gauge Circle */}
        <circle cx="638" cy="145" r="48" fill="none" stroke="#EFECE6" strokeWidth="9" />
        <circle
          cx="638"
          cy="145"
          r="48"
          fill="none"
          stroke="#2D4A3E"
          strokeWidth="9"
          strokeDasharray="301"
          strokeDashoffset="15"
          strokeLinecap="round"
          transform="rotate(-90 638 145)"
        />
        <text x="638" y="144" textAnchor="middle" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="24" fontWeight="800">
          98
        </text>
        <text x="638" y="162" textAnchor="middle" fill="#D4A373" fontFamily="sans-serif" fontSize="10" fontWeight="bold">
          / 100 Điểm
        </text>

        <rect x="526" y="206" width="224" height="24" rx="12" fill="#2D4A3E" />
        <text x="638" y="222" textAnchor="middle" fill="#F7F5F0" fontFamily="Montserrat, sans-serif" fontSize="10" fontWeight="bold">
          ĐẠT CHUẨN LÀNH TÍNH TỐI ƯU
        </text>

        {/* Breakdown bars */}
        <text x="516" y="255" fill="#405349" fontFamily="Montserrat, sans-serif" fontSize="10" fontWeight="bold">
          Phân bố mức độ an toàn EWG
        </text>

        <text x="516" y="278" fill="#405349" fontFamily="sans-serif" fontSize="9">Xanh lá (EWG 1-2): 94%</text>
        <rect x="516" y="284" width="244" height="6" rx="3" fill="#E2E8F0" />
        <rect x="516" y="284" width="229" height="6" rx="3" fill="#2E7D32" />

        <text x="516" y="308" fill="#405349" fontFamily="sans-serif" fontSize="9">Vàng nhẹ (EWG 3-4): 6%</text>
        <rect x="516" y="314" width="244" height="6" rx="3" fill="#E2E8F0" />
        <rect x="516" y="314" width="15" height="6" rx="3" fill="#F59E0B" />

        <text x="516" y="338" fill="#405349" fontFamily="sans-serif" fontSize="9">Đỏ nguy cơ (EWG 5-10): 0%</text>
        <rect x="516" y="344" width="244" height="6" rx="3" fill="#E2E8F0" />

        {/* Quick summary badges */}
        <rect x="516" y="366" width="118" height="48" rx="8" fill="#F7F5F0" stroke="#2D4A3E" strokeOpacity="0.1" />
        <text x="526" y="385" fill="#8F9E8B" fontFamily="sans-serif" fontSize="8" fontWeight="bold">THAI KỲ AN TOÀN</text>
        <text x="526" y="402" fill="#2D4A3E" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold">Được khuyên dùng</text>

        <rect x="642" y="366" width="118" height="48" rx="8" fill="#F7F5F0" stroke="#2D4A3E" strokeOpacity="0.1" />
        <text x="652" y="385" fill="#8F9E8B" fontFamily="sans-serif" fontSize="8" fontWeight="bold">TƯƠNG TÁC DA</text>
        <text x="652" y="402" fill="#D4A373" fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="bold">Dịu nhẹ 100%</text>
      </svg>
    </div>
  );
}
