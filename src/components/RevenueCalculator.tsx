import { useState } from "react";
import { TrendingUp, Users, ShoppingCart, Database } from "lucide-react";

export default function RevenueCalculator() {
  const [mau, setMau] = useState<number>(150000); // 150k monthly active users
  const [conversionRate, setConversionRate] = useState<number>(2.5); // 2.5% premium subscribers
  const [proPrice] = useState<number>(79000); // 79,000 VND / month
  const [affiliateRate, setAffiliateRate] = useState<number>(4.0); // 4% affiliate conversion
  const [b2bContracts, setB2bContracts] = useState<number>(8); // 8 B2B clients

  // Calculations
  const proSubscribers = Math.round((mau * conversionRate) / 100);
  const proMonthlyRevenue = proSubscribers * proPrice;

  // Average basket 350,000 VND, 7% commission
  const affiliateBuyers = Math.round((mau * affiliateRate) / 100);
  const affiliateRevenue = affiliateBuyers * 350000 * 0.07;

  // B2B API / Market report contracts: 25,000,000 VND / month / client
  const b2bRevenue = b2bContracts * 25000000;

  const totalMonthly = proMonthlyRevenue + affiliateRevenue + b2bRevenue;
  const totalAnnual = totalMonthly * 12;

  const formatVND = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + " Tỷ VNĐ";
    }
    return (num / 1000000).toFixed(0) + " Triệu VNĐ";
  };

  return (
    <div className="bento-card p-6 md:p-8 bg-[#FFFFFF] border border-[#2D4A3E]/10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2D4A3E]/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#2D4A3E] font-semibold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-[#D4A373]" /> Mô Phỏng Tài Chính Động 2026
          </div>
          <h3 className="font-playfair text-xl font-bold text-[#2D4A3E]">
            Dự Phóng Dòng Tiền & Doanh Thu Mô Hình
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#8F9E8B]">Doanh thu dự kiến / năm (ARR)</p>
          <p className="text-2xl md:text-3xl font-bold text-[#2D4A3E] tabular-nums font-playfair">
            {formatVND(totalAnnual)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="md:col-span-2 space-y-5">
          {/* MAU Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#405349] font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2D4A3E]" /> Người dùng hoạt động hàng tháng (MAU)
              </span>
              <span className="font-bold text-[#2D4A3E] tabular-nums">
                {mau.toLocaleString("vi-VN")} người
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="1000000"
              step="10000"
              value={mau}
              onChange={(e) => setMau(Number(e.target.value))}
              className="w-full accent-[#2D4A3E] bg-[#EAE6DE] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Conversion to Pro */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#405349] font-medium">
                Tỷ lệ Chuyển đổi Thuê bao Pro (79.000đ/tháng)
              </span>
              <span className="font-bold text-[#D4A373] tabular-nums">
                {conversionRate.toFixed(1)}% ({proSubscribers.toLocaleString("vi-VN")} thuê bao)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-[#D4A373] bg-[#EAE6DE] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Affiliate & B2B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#405349] font-medium flex items-center gap-1">
                  <ShoppingCart className="w-3.5 h-3.5 text-[#2D4A3E]" /> Tỷ lệ Affiliate
                </span>
                <span className="font-bold text-[#2D4A3E] tabular-nums">{affiliateRate}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={affiliateRate}
                onChange={(e) => setAffiliateRate(Number(e.target.value))}
                className="w-full accent-[#2D4A3E] bg-[#EAE6DE] h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#405349] font-medium flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-[#8F9E8B]" /> Đối tác B2B (Spa/Clinic)
                </span>
                <span className="font-bold text-[#2D4A3E] tabular-nums">{b2bContracts} đối tác</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={b2bContracts}
                onChange={(e) => setB2bContracts(Number(e.target.value))}
                className="w-full accent-[#8F9E8B] bg-[#EAE6DE] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#2D4A3E]/10 flex flex-col justify-between space-y-3">
          <p className="text-xs font-bold text-[#405349] uppercase tracking-wider">
            Cơ Cấu Dòng Thu Hàng Tháng
          </p>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#2D4A3E]/10">
              <span className="text-[#405349]">Thuê bao Pro:</span>
              <span className="font-bold text-[#2D4A3E] tabular-nums">
                {formatVND(proMonthlyRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#2D4A3E]/10">
              <span className="text-[#405349]">Hoa hồng Affiliate TMĐT:</span>
              <span className="font-bold text-[#D4A373] tabular-nums">
                {formatVND(affiliateRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#2D4A3E]/10">
              <span className="text-[#405349]">Hợp đồng B2B & Data API:</span>
              <span className="font-bold text-[#405349] tabular-nums">
                {formatVND(b2bRevenue)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#2D4A3E]/15 flex justify-between items-center text-sm font-bold">
            <span className="text-[#1F2E27]">Tổng thu / tháng:</span>
            <span className="text-[#2D4A3E] tabular-nums font-playfair text-base">
              {formatVND(totalMonthly)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
