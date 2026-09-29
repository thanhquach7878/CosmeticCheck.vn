import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Microscope,
  AlertTriangle,
  Award,
  Sparkles,
  Users,
  Target,
  Baby,
  Building2,
  Unlock,
  Link as LinkIcon,
  BarChart3,
  Eye,
  Smartphone,
  PersonStanding,
  Zap,
  Lock,
  Scale,
  CloudCog,
  Megaphone,
  PieChart,
  Download,
  ArrowRight,
  Menu,
  X,
  Radio,
  Check,
  Leaf,
  Search,
  BookOpen,
  Bookmark,
  Calendar,
  Printer
} from "lucide-react";

import IngredientAnalyzerModal from "./components/IngredientAnalyzerModal";
import SavedProductsModal from "./components/SavedProductsModal";
import RevenueCalculator from "./components/RevenueCalculator";
import ChecklistModal from "./components/ChecklistModal";
import ExecutiveSummaryModal from "./components/ExecutiveSummaryModal";
import SearchBar from "./components/SearchBar";

import {
  SKIN_CONCERN_TAGS,
  INGREDIENT_DICTIONARY,
  PRESET_PRODUCTS,
  SkinConcernTag,
  analyzeUnknownIngredient
} from "./data/cosmeticsData";

// Curated Brand-New Skincare & Lifestyle Visuals (Beauty, Personal Care & Organic Wellness)
const UNSPLASH_HERO_BANNER = "/src/assets/images/skincare_organic_hero_1790622729909.jpg"; // Fresh minimalist organic skincare frosted glass dropper on travertine stone
const UNSPLASH_COMMUNITY_CARE = "/src/assets/images/healing_transparency_1790624681315.jpg"; // Minh bạch và chữa lành - Serum thực vật và phục hồi màng ẩm tự nhiên
const UNSPLASH_BOTANICAL = "/src/assets/images/skincare_botanical_pure_1790622754832.jpg"; // Pure organic golden botanical serum drop falling from glass pipette with chamomile & green tea
const UNSPLASH_CLEAN_SKIN = "/src/assets/images/skincare_radiant_glow_1790622765601.jpg"; // Natural portrait of glowing healthy radiant dewy skin, clean beauty
const UNSPLASH_MOTHER_BABY = "/src/assets/images/pregnancy_vegan_care_1790624694905.jpg"; // Mẹ bầu & thuần chay - Chăm sóc da an toàn thai kỳ và thuần chay 100%
const UNSPLASH_SPA_CLINIC = "/src/assets/images/skincare_spa_retreat_1790622777202.jpg"; // Serene Japanese-inspired wellness spa treatment room with cedarwood & bonsai
const UNSPLASH_DERM_CONSULT = "/src/assets/images/clinical_consult_1790599093696.jpg"; // Professional skin specialist consultation & personalized clinical analysis

// Curated high-fidelity assets for previously imageless sections
const IMG_SAFE_TRUST = "/src/assets/images/skincare_safe_trust_1790624728767.jpg"; // Hoạt chất lành tính, zero-toxin
const IMG_CLINICAL_PARTNERS = "/src/assets/images/clinical_partners_1790624705959.jpg"; // Bác sĩ da liễu & đối tác y khoa
const IMG_BUSINESS_REVENUE = "/src/assets/images/business_revenue_streams_1790624715439.jpg"; // Mô hình kinh doanh & doanh thu B2B
const IMG_LAB_RESEARCH = "/src/assets/images/herbal_lab_research_1790601408222.jpg"; // Viện kiểm nghiệm vi sinh
const IMG_APOTHECARY = "/src/assets/images/botanical_apothecary_1790602939128.jpg"; // Bách khoa toàn thư thành phần Janssen
const IMG_AI_SCAN = "/src/assets/images/pitch_ai_scan_1790621367675.jpg"; // Quét phân tích AI OCR
const IMG_COMMERCE = "/src/assets/images/ecommerce_beauty_retail_1790626379382.jpg"; // TMĐT mỹ phẩm chính hãng Shopee / Hasaki
const IMG_ZERO_TRUST = "/src/assets/images/zerotrust_cloud_security_1790626393645.jpg"; // Hạ tầng Zero Trust an ninh dữ liệu
const IMG_LEGAL_TECH = "/src/assets/images/legal_compliance_privacy_1790626406333.jpg"; // Pháp lý & quyền dữ liệu NĐ 13 / GDPR
const IMG_INGREDIENT_LAB = "/src/assets/images/ingredient_lab_1790599061114.jpg"; // Khối Y khoa & AI
const IMG_MARKETING_GROWTH = "/src/assets/images/marketing_growth_studio_1790626420974.jpg"; // Khối Tiếp thị & Tăng trưởng cộng đồng
const IMG_FINANCE_GOVERNANCE = "/src/assets/images/finance_governance_board_1790626433809.jpg"; // Khối Tài chính & Quản trị doanh nghiệp
const IMG_INCI_PARSER_DASHBOARD = "/src/assets/images/inci_parser_dashboard_1790626446200.jpg"; // Giao diện màn hình bóc tách INCI Parser

// Fallback local generated assets in case network is offline
const FALLBACK_HERO = "/src/assets/images/pitch_hero_slide_1790621350690.jpg";
const FALLBACK_BOTANICAL = "/src/assets/images/botanical_extracts_1790601368585.jpg";
const FALLBACK_MOTHER = "/src/assets/images/pregnancy_vegan_care_1790624694905.jpg";
const FALLBACK_SPA = "/src/assets/images/natural_spa_clinic_1790601394265.jpg";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("s1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [analyzerOpen, setAnalyzerOpen] = useState<boolean>(false);
  const [checklistOpen, setChecklistOpen] = useState<boolean>(false);
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false);
  const [savedModalOpen, setSavedModalOpen] = useState<boolean>(false);

  // Synchronized state for SearchBar and INCI Textarea (Two-Way Sync)
  const [searchQuery, setSearchQuery] = useState<string>(
    "Water, Acerola (malpighia punicifolia) fruit extract, Avocado peptide, Allantoin, Aloe vera, Niacinamide, Bisabolol, Sodium Hyaluronate"
  );
  const [onPageInciInput, setOnPageInciInput] = useState<string>(
    "Water, Acerola (malpighia punicifolia) fruit extract, Avocado peptide, Allantoin, Aloe vera, Niacinamide, Bisabolol, Sodium Hyaluronate"
  );

  // Two-way synchronization handler between SearchBar and Textarea components
  const handleSyncSearchAndInci = (value: string) => {
    setSearchQuery(value);
    setOnPageInciInput(value);
  };

  // 4. Skin Concern Filter State
  const [selectedSkinConcernTag, setSelectedSkinConcernTag] = useState<string>("");

  // 1 & 2. Real-time INCI Parsing & EWG Safety Meter for on-page input
  const liveInciParsed = React.useMemo(() => {
    if (!onPageInciInput || !onPageInciInput.trim()) return null;
    const items = onPageInciInput
      .split(/[,;\n•/]+/)
      .map((s) => s.trim().replace(/^[\d\.\-\s]+/, "").replace(/\s*\d+(\.\d+)?%\s*/g, ""))
      .filter((s) => s.length > 1);

    if (items.length === 0) return null;

    let safeCount = 0;
    let cautionCount = 0;
    let highRiskCount = 0;
    let totalScore = 0;
    let pregnancySafe = true;

    const parsed = items.map((raw) => {
      const cleanKey = raw.toLowerCase().replace(/[\(\)]/g, "").trim();
      const matchKey = Object.keys(INGREDIENT_DICTIONARY).find(
        (k) => cleanKey === k || cleanKey.includes(k) || k.includes(cleanKey)
      );
      const info = matchKey ? INGREDIENT_DICTIONARY[matchKey] : analyzeUnknownIngredient(raw);
      if (info.ewgScore <= 2) safeCount++;
      else if (info.ewgScore <= 6) cautionCount++;
      else highRiskCount++;

      totalScore += 11 - info.ewgScore;
      if (!info.pregnancySafe) pregnancySafe = false;

      return { raw, info };
    });

    const finalScore = Math.max(
      15,
      Math.min(99, Math.round((totalScore / (items.length * 10)) * 100))
    );

    return {
      totalCount: items.length,
      safeCount,
      cautionCount,
      highRiskCount,
      finalScore,
      pregnancySafe,
      ingredientsList: parsed
    };
  }, [onPageInciInput]);

  // Customer Segment State
  const [activeSegment, setActiveSegment] = useState<number>(0);

  // Scrollspy observer for navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["s1", "s2", "s3", "s4", "s5", "s10"];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleTriggerAnalysis = (query?: string) => {
    if (query !== undefined) {
      handleSyncSearchAndInci(query);
    }
    setAnalyzerOpen(true);
  };

  // 4. Skin Concern Filter Click Handler
  const handleSelectSkinConcern = (tag: SkinConcernTag) => {
    setSelectedSkinConcernTag(tag.tag);
    handleSyncSearchAndInci(tag.sampleIngredients);
    handleTriggerAnalysis(tag.sampleIngredients);
  };

  const segments = [
    {
      title: "Thị trường Đại chúng (8.4M người)",
      icon: Target,
      iconColor: "text-[#2D4A3E]",
      bgBadge: "bg-[#2D4A3E]/10",
      image: UNSPLASH_CLEAN_SKIN,
      fallbackImg: "/src/assets/images/skincare_clean_1790599075868.jpg",
      description:
        "Những người yêu thích làm đẹp tự nhiên, sở hữu làn da nhạy cảm dễ kích ứng bởi hóa chất, hương liệu nhân tạo và chất bảo quản độc hại.",
      painPoint: "Bị đánh lừa bởi quảng cáo cleanwashing; không hiểu danh pháp hóa học INCI tiếng Anh phức tạp trên nhãn chai.",
      solution: "Bảng điểm an toàn 1-100 trực quan, dịch nghĩa tiếng Việt kèm phân tích khoa học mộc mạc, chuẩn xác."
    },
    {
      title: "Thị trường Ngách (Mẹ bầu & Thuần chay)",
      icon: Baby,
      iconColor: "text-[#D4A373]",
      bgBadge: "bg-[#D4A373]/15",
      image: UNSPLASH_MOTHER_BABY,
      fallbackImg: FALLBACK_MOTHER,
      description:
        "Phụ nữ mang thai, mẹ đang cho con bú và cộng đồng người tiêu dùng mỹ phẩm hữu cơ thuần chay (Vegan) đòi hỏi sự an toàn tuyệt đối.",
      painPoint: "Nỗi bất an về các hoạt chất gây dị tật thai nhi (Retinol, Hydroquinone, BHA liều cao) hoặc dẫn xuất mỡ động vật ẩn giấu.",
      solution: "Bộ lọc thai kỳ tự động phát hiện mọi chất chống chỉ định, gắn nhãn cảnh báo đỏ và gợi ý sản phẩm thảo mộc thay thế."
    },
    {
      title: "Doanh nghiệp B2B (Spa & Phòng khám Da liễu)",
      icon: Building2,
      iconColor: "text-[#8F9E8B]",
      bgBadge: "bg-[#8F9E8B]/15",
      image: UNSPLASH_SPA_CLINIC,
      fallbackImg: FALLBACK_SPA,
      description:
        "Các bác sĩ da liễu, chuyên gia thẩm mỹ, chuỗi spa hữu cơ và nhà phân phối mỹ phẩm cần công cụ đối chiếu thành phần chuyên sâu.",
      painPoint: "Mất nhiều giờ tra cứu thủ công từng hoạt chất khi lên phác đồ điều trị và kê đơn sản phẩm cho khách hàng.",
      solution: "Cổng API tra cứu hàng loạt 45.000+ thành phần và báo cáo phân tích đối chiếu chuyên sâu tức thì."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1F2E27] font-sans">
      {/* ============================================================ */}
      {/* TOP BAR / NAVIGATION (Synchronized Search + CTA)             */}
      {/* ============================================================ */}
      <header className="glass-header fixed top-0 w-full z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          {/* Brand Wordmark */}
          <button
            onClick={() => scrollToSection("s1")}
            className="flex items-center gap-2.5 text-left shrink-0 group"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#2D4A3E] flex items-center justify-center text-[#F7F5F0] shadow-sm transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 text-[#D4A373]" />
            </div>
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#2D4A3E]">
              Cosmetic<span className="text-[#D4A373]">Check</span>.vn
            </span>
          </button>

          {/* Synchronized SearchBar in Header */}
          <div className="hidden md:block flex-1 max-w-xs lg:max-w-md mx-2">
            <SearchBar
              variant="header"
              value={searchQuery}
              onChange={handleSyncSearchAndInci}
              onSearch={handleTriggerAnalysis}
              placeholder="Tìm hoạt chất, mỹ phẩm (Acerola, Allantoin, Avocado peptide...)"
            />
          </div>

          {/* Nav Links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-[#405349]">
            <button
              onClick={() => scrollToSection("s1")}
              className={`hover:text-[#2D4A3E] transition-colors pb-1 ${
                activeSection === "s1"
                  ? "text-[#2D4A3E] border-b-2 border-[#2D4A3E]"
                  : ""
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => scrollToSection("s2")}
              className={`hover:text-[#2D4A3E] transition-colors pb-1 ${
                activeSection === "s2"
                  ? "text-[#2D4A3E] border-b-2 border-[#2D4A3E]"
                  : ""
              }`}
            >
              Giá trị
            </button>
            <button
              onClick={() => scrollToSection("s3")}
              className={`hover:text-[#2D4A3E] transition-colors pb-1 ${
                activeSection === "s3"
                  ? "text-[#2D4A3E] border-b-2 border-[#2D4A3E]"
                  : ""
              }`}
            >
              Khách hàng
            </button>
            <button
              onClick={() => scrollToSection("s4")}
              className={`hover:text-[#2D4A3E] transition-colors pb-1 ${
                activeSection === "s4"
                  ? "text-[#2D4A3E] border-b-2 border-[#2D4A3E]"
                  : ""
              }`}
            >
              Mô hình
            </button>
            <button
              onClick={() => scrollToSection("s5")}
              className={`hover:text-[#2D4A3E] transition-colors pb-1 ${
                activeSection === "s5"
                  ? "text-[#2D4A3E] border-b-2 border-[#2D4A3E]"
                  : ""
              }`}
            >
              Đối tác y khoa
            </button>
            <button
              onClick={() => scrollToSection("s10")}
              className={`hover:text-[#2D4A3E] transition-colors pb-1 ${
                activeSection === "s10"
                  ? "text-[#2D4A3E] border-b-2 border-[#2D4A3E]"
                  : ""
              }`}
            >
              Tiêu chuẩn 15 Bước
            </button>
          </nav>

          {/* Saved Products Shortcut & Primary CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSavedModalOpen(true)}
              className="p-2 text-[#2D4A3E] hover:bg-[#FFFFFF] border border-[#2D4A3E]/15 rounded-xl transition-all shadow-sm flex items-center gap-1.5 px-3 py-2 text-xs font-bold font-heading"
              title="Xem các sản phẩm đã lưu"
            >
              <Bookmark className="w-4 h-4 text-[#D4A373]" />
              <span className="hidden sm:inline">Đã lưu</span>
            </button>

            {/* CTA Button renamed to "Phân tích thành phần" */}
            <button
              onClick={() => handleTriggerAnalysis(searchQuery || onPageInciInput)}
              className="btn-primary-action px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide shadow-glow-primary flex items-center gap-2 whitespace-nowrap font-heading"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Phân tích thành phần</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#2D4A3E]"
              aria-label="Mở menu di động"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#F7F5F0]/98 border-b border-[#2D4A3E]/10 px-6 py-6 space-y-4 backdrop-blur-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#8F9E8B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Gõ tên chất cần kiểm tra..."
                value={searchQuery}
                onChange={(e) => handleSyncSearchAndInci(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTriggerAnalysis(searchQuery);
                }}
                className="w-full bg-[#FFFFFF] border border-[#2D4A3E]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#1F2E27] placeholder-[#8F9E8B] focus:outline-none focus:border-[#2D4A3E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSyncSearchAndInci("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#8F9E8B] hover:text-[#2D4A3E]"
                  aria-label="Xóa từ khóa"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col space-y-3 text-sm font-semibold">
              <button
                onClick={() => scrollToSection("s1")}
                className="text-left py-1 text-[#405349] hover:text-[#2D4A3E]"
              >
                Trang chủ
              </button>
              <button
                onClick={() => scrollToSection("s2")}
                className="text-left py-1 text-[#405349] hover:text-[#2D4A3E]"
              >
                Giá trị cốt lõi
              </button>
              <button
                onClick={() => scrollToSection("s3")}
                className="text-left py-1 text-[#405349] hover:text-[#2D4A3E]"
              >
                Phân khúc khách hàng
              </button>
              <button
                onClick={() => scrollToSection("s4")}
                className="text-left py-1 text-[#405349] hover:text-[#2D4A3E]"
              >
                Mô hình kinh doanh
              </button>
              <button
                onClick={() => scrollToSection("s5")}
                className="text-left py-1 text-[#405349] hover:text-[#2D4A3E]"
              >
                Hệ sinh thái đối tác
              </button>
              <button
                onClick={() => scrollToSection("s10")}
                className="text-left py-1 text-[#405349] hover:text-[#2D4A3E]"
              >
                Tiêu chuẩn 15 Bước
              </button>
            </div>

            <div className="pt-3 border-t border-[#2D4A3E]/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSavedModalOpen(true);
                }}
                className="w-full py-2.5 bg-[#FFFFFF] border border-[#2D4A3E]/20 text-[#2D4A3E] font-bold text-center rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#D4A373]" /> Sản phẩm đã lưu
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleTriggerAnalysis(searchQuery || onPageInciInput);
                }}
                className="w-full py-3 bg-[#2D4A3E] text-[#F7F5F0] font-bold text-center rounded-xl text-sm shadow-sm font-heading"
              >
                Phân tích thành phần
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">
        {/* ============================================================ */}
        {/* S1: HERO SECTION (SYNCHRONIZED SEARCH, AUTOCOMPLETE & PARSER) */}
        {/* ============================================================ */}
        <section
          id="s1"
          className="relative min-h-[94vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 py-12"
        >
          {/* Background Image: High-res Unsplash Banner */}
          <div className="absolute inset-0 z-0">
            <img
              src={UNSPLASH_HERO_BANNER}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_HERO;
              }}
              alt="Mỹ phẩm thảo mộc và phân tích hoạt chất da liễu"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-20 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F7F5F0] via-[#F7F5F0]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F0] via-transparent to-[#F7F5F0]" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto py-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2D4A3E]/15 bg-[#FFFFFF]/90 backdrop-blur-md mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A373] animate-pulse" />
              <span className="text-xs font-bold text-[#2D4A3E] tracking-wide font-heading">
                Kiến trúc & Kế hoạch Kinh doanh 2026 · Encyclopedia of Ingredients
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold text-[#2D4A3E] mb-5 leading-[1.15] text-soft-shadow">
              Phân Tích AI Đột Phá <br />
              <span className="text-[#D4A373] italic">
                Chữa Lành & Bảo Vệ Làn Da
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#405349] font-sans max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
              CosmeticCheck.vn tích hợp toàn bộ dữ liệu <strong>Encyclopedia of Ingredients</strong> (Acerola, AHAs, Allantoin, Peptide bơ, Arbutin...) và tiếp nhận <strong>mọi hoạt chất bên ngoài</strong> qua khung phân tích mở rộng không bao giờ báo lỗi.
            </p>

            {/* Synchronized Hero Center Search Bar Component */}
            <div className="max-w-2xl mx-auto mb-4">
              <SearchBar
                variant="hero"
                value={searchQuery}
                onChange={handleSyncSearchAndInci}
                onSearch={handleTriggerAnalysis}
                placeholder="Gõ hoạt chất (Acerola, Peptide bơ, Retinol, Niacinamide...) hoặc dán công thức..."
                showSyncBadge={true}
              />
            </div>

            {/* 4. Skin Concern Clickable Tags (Bộ lọc nhanh theo tình trạng da) */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-1.5 mb-2 text-xs font-bold text-[#8F9E8B] font-heading">
                <span>Chọn theo nhu cầu làn da (Bộ lọc nhanh):</span>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-2 text-xs">
                {SKIN_CONCERN_TAGS.map((tagItem) => {
                  const isSelected = selectedSkinConcernTag === tagItem.tag;
                  return (
                    <button
                      key={tagItem.tag}
                      onClick={() => handleSelectSkinConcern(tagItem)}
                      className={`px-3.5 py-1.5 rounded-xl border font-bold transition-all text-xs flex items-center gap-1 shadow-sm ${
                        isSelected
                          ? "bg-[#2D4A3E] text-[#F7F5F0] border-[#2D4A3E] ring-2 ring-[#D4A373]/50 scale-105"
                          : "bg-[#FFFFFF] border-[#2D4A3E]/15 hover:border-[#2D4A3E] text-[#2D4A3E] hover:text-[#D4A373]"
                      }`}
                      title={tagItem.description}
                    >
                      <span>{tagItem.tag}</span>
                      <span className={`text-[10px] font-normal ${isSelected ? "text-[#D4A373]" : "text-[#8F9E8B]"}`}>
                        ({tagItem.label.split("&")[0]})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1. On-Page Large Textarea for Copy-Pasting Full INCI Ingredient List */}
            <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#2D4A3E]/15 shadow-md text-left space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#2D4A3E] font-heading flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4A373]" /> Dán nguyên bảng thành phần (Water, Niacinamide, Glycerin...):
                  </label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đồng bộ 2 chiều với SearchBar
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {onPageInciInput && (
                    <span className="text-[11px] font-bold text-[#2D4A3E] bg-[#2D4A3E]/10 px-2 py-0.5 rounded-md">
                      {liveInciParsed?.totalCount || 0} thành phần
                    </span>
                  )}
                  <button
                    onClick={() => {
                      handleSyncSearchAndInci("");
                      setSelectedSkinConcernTag("");
                    }}
                    className="text-xs text-[#D4A373] hover:underline font-bold"
                  >
                    Xóa văn bản
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={onPageInciInput}
                onChange={(e) => handleSyncSearchAndInci(e.target.value)}
                placeholder="Dán toàn bộ danh sách thành phần in trên bao bì hoặc Shopee tại đây..."
                className="w-full bg-[#F7F5F0] border border-[#2D4A3E]/15 rounded-xl p-3 text-xs sm:text-sm text-[#1F2E27] placeholder-[#8F9E8B] focus:outline-none focus:border-[#2D4A3E] leading-relaxed font-sans"
              />

              {/* Live Real-time INCI Breakdown & EWG Meter */}
              {liveInciParsed && liveInciParsed.totalCount > 0 && (
                <div className="p-3.5 bg-[#FAF9F5] border border-[#2D4A3E]/10 rounded-2xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-base text-[#2D4A3E]">
                        {liveInciParsed.finalScore}%
                      </span>
                      <span className="text-[11px] text-[#405349] font-medium">Độ Lành Tính</span>
                      <span className="text-slate-300">·</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          liveInciParsed.pregnancySafe
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {liveInciParsed.pregnancySafe ? "Mẹ bầu an tâm" : "Cảnh báo thai kỳ"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        Xanh lá (1-2): {liveInciParsed.safeCount}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Vàng (3-6): {liveInciParsed.cautionCount}
                      </span>
                      {liveInciParsed.highRiskCount > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-rose-700">
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                          Đỏ (7-10): {liveInciParsed.highRiskCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual EWG Spectrum Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${(liveInciParsed.safeCount / liveInciParsed.totalCount) * 100}%` }}
                      className="bg-emerald-600 h-full transition-all"
                      title={`An toàn (EWG 1-2): ${liveInciParsed.safeCount}`}
                    />
                    <div
                      style={{ width: `${(liveInciParsed.cautionCount / liveInciParsed.totalCount) * 100}%` }}
                      className="bg-amber-500 h-full transition-all"
                      title={`Lưu ý theo nồng độ (EWG 3-6): ${liveInciParsed.cautionCount}`}
                    />
                    <div
                      style={{ width: `${(liveInciParsed.highRiskCount / liveInciParsed.totalCount) * 100}%` }}
                      className="bg-rose-600 h-full transition-all"
                      title={`Nguy cơ cao (EWG 7-10): ${liveInciParsed.highRiskCount}`}
                    />
                  </div>

                  {/* Preview of first recognized ingredients */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-[#8F9E8B] uppercase font-bold mr-1">Các chất nhận diện:</span>
                    {liveInciParsed.ingredientsList.slice(0, 5).map((ing, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                          ing.info.ewgScore <= 2
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : ing.info.ewgScore <= 6
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        <span>{ing.info.name}</span>
                        <span className="font-bold">EWG {ing.info.ewgScore}</span>
                      </span>
                    ))}
                    {liveInciParsed.totalCount > 5 && (
                      <span className="text-[10px] text-[#8F9E8B]">
                        +{liveInciParsed.totalCount - 5} chất khác...
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-[#8F9E8B]">
                  Hệ thống tự động cắt theo dấu phẩy và phân tích toàn diện mã màu EWG, độ bít tắc và tài liệu y khoa.
                </span>

                <button
                  onClick={() => handleTriggerAnalysis(onPageInciInput)}
                  className="btn-primary-action px-5 py-2.5 rounded-xl font-bold text-xs shadow-glow-primary flex items-center gap-1.5 font-heading"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Phân tích thành phần</span>
                </button>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-10 pt-8 border-t border-[#2D4A3E]/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl md:text-3xl font-heading font-extrabold text-[#2D4A3E] tabular-nums">
                  170+
                </p>
                <p className="text-xs text-[#8F9E8B] mt-1">Hoạt chất Encyclopedia PDF</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-heading font-extrabold text-[#D4A373] tabular-nums">
                  Khung mở rộng
                </p>
                <p className="text-xs text-[#8F9E8B] mt-1">Tự động nhận diện chất bên ngoài</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-heading font-extrabold text-[#2D4A3E] tabular-nums">
                  &lt; 200ms
                </p>
                <p className="text-xs text-[#8F9E8B] mt-1">Đồng bộ tìm kiếm tức thì</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-heading font-extrabold text-[#8F9E8B] tabular-nums">
                  100% Y Khoa
                </p>
                <p className="text-xs text-[#8F9E8B] mt-1">Chuẩn CIR & EWG Skin Deep 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S2: MỤC TIÊU GIÁ TRỊ CỐT LÕI (BENTO GRID WITH UNSPLASH)       */}
        {/* ============================================================ */}
        <section id="s2" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold text-[#D4A373] uppercase tracking-widest block mb-2 font-heading">
              Sứ mệnh nền tảng
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#2D4A3E] mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-[#405349] max-w-2xl mx-auto text-sm sm:text-base">
              Hệ sinh thái phân tích mỹ phẩm toàn diện, minh bạch và an toàn, giải quyết triệt để vấn nạn greenwashing trên thị trường.
            </p>
          </div>

          {/* Bento Grid Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Big Marquee Bento Card (Spans 2 columns) */}
            <div className="bento-card md:col-span-2 flex flex-col justify-between p-8 group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#2D4A3E]/10 flex items-center justify-center mb-6 border border-[#2D4A3E]/20">
                  <Microscope className="text-[#2D4A3E] w-6 h-6" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-[#2D4A3E] mb-3 group-hover:text-[#D4A373] transition-colors">
                  Phân Tích Chi Tiết Toàn Bộ Thành Phần
                </h3>
                <p className="text-[#405349] text-sm md:text-base leading-relaxed mb-6">
                  Hệ thống bóc tách chi tiết từng thành phần từ hàng ngàn thương hiệu (gồm danh mục Encyclopedia PDF như Acerola, Peptide bơ, AHAs, Allantoin... và mọi chất bên ngoài), đối chiếu với cơ sở dữ liệu y khoa để đánh giá chính xác công dụng và mức độ an toàn.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#2D4A3E]/10 relative h-60 bg-[#EAE6DE]">
                <img
                  src={UNSPLASH_BOTANICAL}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_BOTANICAL;
                  }}
                  alt="Chiết xuất thực vật và hoạt chất tự nhiên"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A3E]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-white">
                  <span className="bg-[#2D4A3E]/80 px-3 py-1 rounded-xl backdrop-blur font-medium">
                    Janssen Encyclopedia of Ingredients & EWG 2026
                  </span>
                  <button
                    onClick={() => handleTriggerAnalysis(onPageInciInput)}
                    className="btn-primary-action px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 font-heading"
                  >
                    Phân tích thành phần <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3 feature cards with rich visual previews */}
            <div className="space-y-6 flex flex-col justify-between">
              {/* Card 1 */}
              <div className="bento-card p-5 group flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-[#2D4A3E]/10 relative bg-[#EAE6DE]">
                  <img
                    src={IMG_SAFE_TRUST}
                    alt="Hoạt chất làm dịu và bảo vệ da không độc hại"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1 left-1 bg-rose-700/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur">
                    Zero Toxin
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-rose-100 border border-rose-200 shrink-0">
                      <AlertTriangle className="text-rose-700 w-4 h-4" />
                    </div>
                    <h4 className="text-base font-heading font-bold text-[#2D4A3E]">
                      Cảnh Báo Độc Hại & Kích Ứng
                    </h4>
                  </div>
                  <p className="text-xs text-[#405349] leading-relaxed">
                    Phát hiện ngay lập tức các chất dễ gây kích ứng, paraben, hương liệu tổng hợp, cồn khô gây hại cho da nhạy cảm hoặc rủi ro cho thai kỳ.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bento-card p-5 group flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-[#2D4A3E]/10 relative bg-[#EAE6DE]">
                  <img
                    src={IMG_CLINICAL_PARTNERS}
                    alt="Đánh giá khoa học y khoa y học chứng cứ"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1 left-1 bg-[#2D4A3E]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur">
                    120k+ Báo cáo
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 shrink-0">
                      <Award className="text-[#2D4A3E] w-4 h-4" />
                    </div>
                    <h4 className="text-base font-heading font-bold text-[#2D4A3E]">
                      Đánh Giá Khoa Học Y Khoa
                    </h4>
                  </div>
                  <p className="text-xs text-[#405349] leading-relaxed">
                    Mức độ an toàn được xếp hạng khách quan dựa trên hơn 120.000 bài báo cáo nghiên cứu và dữ liệu lâm sàng PubMed có thẩm định.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bento-card p-5 group flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-[#2D4A3E]/10 relative bg-[#EAE6DE]">
                  <img
                    src={UNSPLASH_CLEAN_SKIN}
                    alt="Cá nhân hóa độc bản theo làn da"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1 left-1 bg-[#D4A373]/90 text-[#2D4A3E] text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur">
                    Độc Bản
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-[#D4A373]/15 border border-[#D4A373]/25 shrink-0">
                      <Sparkles className="text-[#D4A373] w-4 h-4" />
                    </div>
                    <h4 className="text-base font-heading font-bold text-[#2D4A3E]">
                      Cá Nhân Hóa Độc Bản
                    </h4>
                  </div>
                  <p className="text-xs text-[#405349] leading-relaxed">
                    Gợi ý giải pháp và đề xuất sản phẩm thay thế lành tính, tối ưu hóa riêng biệt theo đặc tính từng làn da (Dầu, Khô, Mụn, Rosacea).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card with Image: Minh bạch & Chữa lành */}
          <div className="mt-6 bento-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4A373] uppercase tracking-wider mb-2 font-heading">
                <Users className="w-4 h-4" /> Minh bạch & Chữa lành
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#2D4A3E] mb-3">
                Minh Bạch Toàn Diện & Chữa Lành Hàng Rào Da
              </h3>
              <p className="text-[#405349] text-sm leading-relaxed max-w-xl mb-4">
                Sứ mệnh minh bạch hóa từng giọt tinh chất: bóc tách mọi hóa chất ẩn giấu, tái lập hàng rào bảo vệ sinh học da và chia sẻ hành trình phục hồi an toàn từ cộng đồng hơn 12.800+ người tiêu dùng thực tế.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#2D4A3E]/10 text-[#2D4A3E] rounded-lg text-xs font-bold font-heading">
                  100% Không Cleanwashing
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold font-heading">
                  Phục Hồi Hàng Rào Lipid
                </span>
                <span className="px-3 py-1 bg-[#D4A373]/20 text-[#2D4A3E] rounded-lg text-xs font-bold font-heading">
                  12.800+ Đánh Giá Kiểm Chứng
                </span>
              </div>
            </div>
            <div className="w-full md:w-96 h-52 rounded-2xl overflow-hidden relative border border-[#2D4A3E]/10 shrink-0 shadow-md bg-[#EAE6DE]">
              <img
                src={UNSPLASH_COMMUNITY_CARE}
                alt="Minh bạch thành phần mỹ phẩm và chữa lành làn da"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A3E]/85 via-transparent to-transparent flex items-end justify-between p-4">
                <div>
                  <span className="text-white text-xs font-bold font-heading block">Minh Bạch & Chữa Lành</span>
                  <span className="text-slate-200 text-[10px]">Cộng đồng làm đẹp an toàn 2026</span>
                </div>
                <span className="bg-[#D4A373] text-[#2D4A3E] text-[10px] font-extrabold px-2.5 py-1 rounded-full font-heading shadow">
                  Đã Kiểm Chứng
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S3: PHÂN KHÚC KHÁCH HÀNG & VẤN ĐỀ                            */}
        {/* ============================================================ */}
        <section id="s3" className="py-24 bg-[#EFECE6]/50 border-y border-[#2D4A3E]/10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Dynamic Visual Stack with Unsplash Images */}
            <div className="relative h-[560px] w-full bento-card p-6 overflow-hidden flex flex-col justify-between">
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[#2D4A3E]/10 shadow-sm group">
                <img
                  src={segments[activeSegment].image}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = segments[activeSegment].fallbackImg;
                  }}
                  alt={segments[activeSegment].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A3E]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-xs font-bold text-white font-heading">
                  {segments[activeSegment].title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="h-28 rounded-xl overflow-hidden border border-[#2D4A3E]/10 relative">
                  <img
                    src={UNSPLASH_MOTHER_BABY}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_MOTHER;
                    }}
                    alt="Chăm sóc da mẹ bầu an toàn"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                  />
                  <span className="absolute bottom-1.5 left-2 bg-[#2D4A3E]/85 text-[10px] text-white px-2 py-0.5 rounded backdrop-blur font-heading">
                    Mẹ bầu & Thuần chay
                  </span>
                </div>
                <div className="h-28 rounded-xl overflow-hidden border border-[#2D4A3E]/10 relative">
                  <img
                    src={UNSPLASH_SPA_CLINIC}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_SPA;
                    }}
                    alt="Spa hữu cơ trị liệu da liễu"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                  />
                  <span className="absolute bottom-1.5 left-2 bg-[#2D4A3E]/85 text-[10px] text-white px-2 py-0.5 rounded backdrop-blur font-heading">
                    B2B Spa & Clinic
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#2D4A3E]/10 text-xs text-[#405349] flex items-center justify-between">
                <span>Khảo sát 2026: 78% người tiêu dùng tìm kiếm mỹ phẩm minh bạch.</span>
                <button
                  onClick={() => handleTriggerAnalysis(searchQuery || onPageInciInput)}
                  className="btn-primary-action px-3 py-1.5 rounded-lg text-xs font-bold font-heading"
                >
                  Phân tích thành phần
                </button>
              </div>
            </div>

            {/* Right: Text Content & Segment Toggles */}
            <div className="space-y-6">
              <div>
                <span className="text-[#D4A373] font-bold tracking-wider text-xs uppercase block mb-1 font-heading">
                  Thấu hiểu thị trường
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#2D4A3E] mb-4">
                  Giải Quyết Nỗi Đau Nhiễu Loạn Thông Tin
                </h2>
                <p className="text-[#405349] text-sm md:text-base leading-relaxed">
                  Người tiêu dùng ngày càng quan tâm đến sức khỏe làn da, nhưng lại đối mặt với ma
                  trận thông tin thành phần không rõ ràng. Chúng tôi giải quyết triệt để sự thiếu minh bạch này.
                </p>
              </div>

              <div className="space-y-3">
                {segments.map((seg, idx) => {
                  const Icon = seg.icon;
                  const isActive = activeSegment === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveSegment(idx)}
                      className={`bento-card p-5 cursor-pointer transition-all ${
                        isActive
                          ? "border-[#2D4A3E] bg-[#FFFFFF] shadow-md ring-1 ring-[#2D4A3E]"
                          : "border-[#2D4A3E]/10 bg-[#FFFFFF]/70 hover:bg-[#FFFFFF]"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl shrink-0 ${seg.bgBadge}`}>
                          <Icon className={`w-5 h-5 ${seg.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[#2D4A3E] font-bold text-base font-heading">{seg.title}</h4>
                            {isActive && (
                              <span className="text-xs text-[#D4A373] font-bold flex items-center gap-1 font-heading">
                                <Check className="w-3.5 h-3.5" /> Đang chọn
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#405349] mt-1 leading-relaxed">
                            {seg.description}
                          </p>

                          {isActive && (
                            <div className="mt-3 pt-3 border-t border-[#2D4A3E]/10 space-y-1.5 text-xs">
                              <p className="text-rose-700">
                                <strong>Vấn đề thực tế:</strong> {seg.painPoint}
                              </p>
                              <p className="text-[#2D4A3E]">
                                <strong>Giải pháp CosmeticCheck:</strong> {seg.solution}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S4: MÔ HÌNH DOANH THU & KÊNH TRUYỀN THÔNG                    */}
        {/* ============================================================ */}
        <section id="s4" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold text-[#D4A373] uppercase tracking-widest block mb-2 font-heading">
              Kinh doanh bền vững
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#2D4A3E] mb-4">
              Mô Hình Sinh Lời & Đa Kênh
            </h2>
            <p className="text-[#405349] max-w-2xl mx-auto text-sm sm:text-base">
              Chiến lược phát triển bền vững kết hợp giáo dục thị trường và các luồng doanh thu đa dạng dựa trên giá trị dữ liệu y khoa chuẩn hóa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Stream 1 */}
            <div className="bento-card overflow-hidden border-t-4 border-t-[#2D4A3E] group flex flex-col justify-between">
              <div className="h-36 w-full overflow-hidden relative bg-[#EAE6DE]">
                <img
                  src={IMG_AI_SCAN}
                  alt="Freemium Subscription - Phân tích AI bóc tách hoạt chất"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                <span className="absolute top-3 left-3 bg-[#2D4A3E] text-[#F7F5F0] text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur shadow-sm font-heading">
                  B2C Subscription
                </span>
              </div>
              <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-[#2D4A3E]/10">
                      <Unlock className="text-[#2D4A3E] w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-[#2D4A3E]">Freemium Subscription</h4>
                  </div>
                  <p className="text-xs md:text-sm text-[#405349] leading-relaxed mb-4">
                    Tra cứu cơ bản miễn phí. Thu phí mở khóa phân tích chuyên sâu (79.000đ/tháng), so
                    sánh chi tiết hai sản phẩm song song và cảnh báo dị ứng cá nhân hóa theo hồ sơ da.
                  </p>
                </div>
                <div className="text-xs text-[#2D4A3E] font-bold font-heading pt-2 border-t border-[#2D4A3E]/10">
                  Tỷ lệ kỳ vọng: 2.5% MAU chuyển đổi
                </div>
              </div>
            </div>

            {/* Stream 2 */}
            <div className="bento-card overflow-hidden border-t-4 border-t-[#D4A373] group flex flex-col justify-between">
              <div className="h-36 w-full overflow-hidden relative bg-[#EAE6DE]">
                <img
                  src={IMG_COMMERCE}
                  alt="Affiliate TMĐT mỹ phẩm an toàn chính hãng"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                <span className="absolute top-3 left-3 bg-[#D4A373] text-[#2D4A3E] text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur shadow-sm font-heading">
                  Hoa hồng 5% - 8%
                </span>
              </div>
              <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-[#D4A373]/15">
                      <LinkIcon className="text-[#D4A373] w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-[#2D4A3E]">Affiliate TMĐT</h4>
                  </div>
                  <p className="text-xs md:text-sm text-[#405349] leading-relaxed mb-4">
                    Nhận hoa hồng từ các giao dịch mua sắm chuyển hướng an toàn đến Shopee Mall,
                    Lazada Mall, Guardian và Hasaki khi người dùng chọn mua sản phẩm đạt chuẩn lành tính.
                  </p>
                </div>
                <div className="text-xs text-[#D4A373] font-bold font-heading pt-2 border-t border-[#2D4A3E]/10">
                  Liên kết chính hãng 100%
                </div>
              </div>
            </div>

            {/* Stream 3 */}
            <div className="bento-card overflow-hidden border-t-4 border-t-[#8F9E8B] group flex flex-col justify-between">
              <div className="h-36 w-full overflow-hidden relative bg-[#EAE6DE]">
                <img
                  src={IMG_BUSINESS_REVENUE}
                  alt="B2B Data and R&D Reports cho ngành mỹ phẩm"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                <span className="absolute top-3 left-3 bg-[#8F9E8B] text-[#1F2E27] text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur shadow-sm font-heading">
                  B2B ARR định kỳ
                </span>
              </div>
              <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-[#8F9E8B]/15">
                      <BarChart3 className="text-[#8F9E8B] w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-[#2D4A3E]">B2B Data & R&D Reports</h4>
                  </div>
                  <p className="text-xs md:text-sm text-[#405349] leading-relaxed mb-4">
                    Bán báo cáo xu hướng nguyên liệu, phân tích nhu cầu người tiêu dùng và cung cấp API
                    tra cứu cho các viện nghiên cứu, công ty gia công mỹ phẩm OEM/ODM hàng đầu.
                  </p>
                </div>
                <div className="text-xs text-[#8F9E8B] font-bold font-heading pt-2 border-t border-[#2D4A3E]/10">
                  Doanh thu định kỳ (ARR B2B)
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Interactive Revenue Simulator */}
          <RevenueCalculator />

          <div className="mt-8 p-4 bg-[#FFFFFF] border border-[#2D4A3E]/10 rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-sm">
            <p className="text-xs md:text-sm text-[#2D4A3E] font-medium flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#D4A373]" /> Kênh tiếp cận đa chạm: Web Progressive App, TikTok Skincare Education, SEO Content Y khoa, Email Newsletter.
            </p>
            <button
              onClick={() => handleTriggerAnalysis(searchQuery || onPageInciInput)}
              className="btn-primary-action px-4 py-2 rounded-xl text-xs font-bold font-heading"
            >
              Phân tích thành phần
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S5: NGUỒN LỰC & ĐỐI TÁC (PARTNERSHIP ECOSYSTEM)              */}
        {/* ============================================================ */}
        <section id="s5" className="py-20 border-y border-[#2D4A3E]/10 bg-gradient-to-b from-transparent to-[#EFECE6]/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#D4A373] uppercase tracking-widest block mb-2 font-heading">
                Hợp tác chiến lược
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#2D4A3E] mb-3">
                Hệ Sinh Thái Đối Tác & Bảo Trợ Khoa Học
              </h2>
              <p className="text-[#405349] text-sm max-w-2xl mx-auto">
                Đội ngũ cố vấn Bác sĩ Da liễu, Dược sĩ Chuyên khoa cùng hạ tầng công nghệ đám mây tạo nên sức mạnh dữ liệu của CosmeticCheck.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Partner 1 */}
              <div className="bento-card overflow-hidden group flex flex-col">
                <div className="h-32 w-full overflow-hidden relative bg-[#EAE6DE]">
                  <img
                    src={IMG_CLINICAL_PARTNERS}
                    alt="Hội Da Liễu và Bác sĩ thẩm định"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-5 pt-1 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[#2D4A3E] font-bold text-base font-heading">Hội Da Liễu & Bác Sĩ</h4>
                    <p className="text-xs text-[#8F9E8B] mt-1.5 leading-relaxed">
                      Hội đồng thẩm định y khoa độc lập, cố vấn phác đồ điều trị và đối chiếu lâm sàng.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#2D4A3E] bg-[#2D4A3E]/10 py-1 px-2.5 rounded-full mt-3 self-center">
                    Cố Vấn Chuyên Môn
                  </span>
                </div>
              </div>

              {/* Partner 2 */}
              <div className="bento-card overflow-hidden group flex flex-col">
                <div className="h-32 w-full overflow-hidden relative bg-[#EAE6DE]">
                  <img
                    src={IMG_COMMERCE}
                    alt="Hệ thống phân phối TMĐT chính hãng Shopee Mall Guardian Hasaki"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl bg-[#D4A373] text-[#2D4A3E] flex items-center justify-center shadow-md">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-5 pt-1 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[#2D4A3E] font-bold text-base font-heading">Hệ Thống TMĐT</h4>
                    <p className="text-xs text-[#8F9E8B] mt-1.5 leading-relaxed">
                      Shopee Mall, Guardian, Hasaki API kết nối liên kết giỏ hàng chính hãng 100%.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#D4A373] bg-[#D4A373]/20 py-1 px-2.5 rounded-full mt-3 self-center">
                    Đối Tác Phân Phối
                  </span>
                </div>
              </div>

              {/* Partner 3 */}
              <div className="bento-card overflow-hidden group flex flex-col">
                <div className="h-32 w-full overflow-hidden relative bg-[#EAE6DE]">
                  <img
                    src={IMG_APOTHECARY}
                    alt="Bách khoa toàn thư hoạt chất mỹ phẩm Janssen"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl bg-[#8F9E8B] text-white flex items-center justify-center shadow-md">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-5 pt-1 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[#2D4A3E] font-bold text-base font-heading">Janssen Cosmetics</h4>
                    <p className="text-xs text-[#8F9E8B] mt-1.5 leading-relaxed">
                      Dữ liệu Encyclopedia of Ingredients chuẩn hóa 170+ hoạt chất dược mỹ phẩm chuẩn Đức.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#8F9E8B] bg-[#8F9E8B]/15 py-1 px-2.5 rounded-full mt-3 self-center">
                    Cơ Sở Dữ Liệu Gốc
                  </span>
                </div>
              </div>

              {/* Partner 4 */}
              <div className="bento-card overflow-hidden group flex flex-col">
                <div className="h-32 w-full overflow-hidden relative bg-[#EAE6DE]">
                  <img
                    src={IMG_LAB_RESEARCH}
                    alt="Viện kiểm nghiệm vi sinh và nồng độ hoạt chất"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl bg-[#2D4A3E] text-white flex items-center justify-center shadow-md">
                    <Microscope className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-5 pt-1 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[#2D4A3E] font-bold text-base font-heading">Viện Kiểm Nghiệm</h4>
                    <p className="text-xs text-[#8F9E8B] mt-1.5 leading-relaxed">
                      Kiểm nghiệm vi sinh, đo lường nồng độ thực tế và phát hiện kim loại nặng, corticoid.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#2D4A3E] bg-[#2D4A3E]/10 py-1 px-2.5 rounded-full mt-3 self-center">
                    Kiểm Nghiệm Lâm Sàng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S9: UI/UX & ACCESSIBILITY (WCAG 2.1 TRỢ NĂNG)                 */}
        {/* ============================================================ */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text & Criteria */}
            <div className="order-2 lg:order-1">
              <span className="bg-[#2D4A3E]/10 text-[#2D4A3E] text-xs font-bold px-3 py-1 rounded-full border border-[#2D4A3E]/20 uppercase font-heading">
                Chuẩn Trợ Năng Quốc Tế
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#2D4A3E] mt-4 mb-6">
                Thiết Kế Mộc Mạc, Dễ Tiếp Cận Cho Mọi Người
              </h2>
              <p className="text-[#405349] text-sm md:text-base leading-relaxed mb-8">
                Trải nghiệm người dùng được tối ưu hóa theo quy chuẩn thiết kế bao trùm (Inclusive Design), thân thiện với thị giác nhờ tông màu ấm áp và phông chữ Montserrat & Lato sắc nét.
              </p>

              <div className="space-y-4">
                <div className="bento-card p-4 flex gap-4 items-center">
                  <Eye className="text-[#2D4A3E] w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-[#2D4A3E] font-bold text-sm font-heading">Luồng Thị Giác Gutenberg & F-Pattern</h4>
                    <p className="text-xs text-[#405349]">
                      Bố cục tự nhiên giúp người đọc nắm bắt thông tin thành phần quan trọng trong 3 giây đầu tiên.
                    </p>
                  </div>
                </div>

                <div className="bento-card p-4 flex gap-4 items-center">
                  <Smartphone className="text-[#D4A373] w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-[#2D4A3E] font-bold text-sm font-heading">Tương Thích Cảm Ứng Di Động 100%</h4>
                    <p className="text-xs text-[#405349]">
                      Các nút bấm và ô tìm kiếm đạt chuẩn touch target &ge; 44px, mượt mà khi thao tác bằng một tay trên điện thoại.
                    </p>
                  </div>
                </div>

                <div className="bento-card p-4 flex gap-4 items-center border-l-4 border-l-[#2D4A3E]">
                  <PersonStanding className="text-[#2D4A3E] w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="text-[#2D4A3E] font-bold text-sm font-heading">Tuân Thủ WCAG 2.1 AA</h4>
                    <p className="text-xs text-[#405349]">
                      Độ tương phản chữ trên nền ngà đạt 7.2:1, hỗ trợ phím Tab điều hướng và công nghệ đọc màn hình.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: WCAG Visual Card with UI Dashboard */}
            <div className="order-1 lg:order-2 bento-card p-6 bg-[#FFFFFF]">
              <div className="h-56 rounded-2xl overflow-hidden mb-5 border border-[#2D4A3E]/10">
                <img
                  src={IMG_INCI_PARSER_DASHBOARD}
                  alt="Giao diện CosmeticCheck đạt chuẩn trợ năng WCAG 2.1 AA trực quan dễ đọc"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#2D4A3E]/10 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#2D4A3E]/10">
                  <span className="text-[#405349] font-medium">Tỷ lệ Tương phản Màu sắc:</span>
                  <span className="font-bold text-[#2D4A3E] font-heading">7.2:1 (Đạt WCAG AAA)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#2D4A3E]/10">
                  <span className="text-[#405349] font-medium">Phông chữ hiển thị:</span>
                  <span className="font-bold text-[#D4A373] font-heading">Montserrat & Lato</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#405349] font-medium">Độ mỏi mắt khi đọc lâu:</span>
                  <span className="font-bold text-[#2D4A3E]">Giảm 45% so với Dark Mode chói</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S10: TỐI ƯU TỐC ĐỘ, SEO & BẢO MẬT (15 BƯỚC CHECKLIST)         */}
        {/* ============================================================ */}
        <section
          id="s10"
          className="py-24 bg-[#EFECE6]/40 border-y border-[#2D4A3E]/10 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-xs font-bold text-[#D4A373] uppercase tracking-widest block mb-2 font-heading">
                  15 Bước Rà Soát Kỹ Thuật
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#2D4A3E] mb-3">
                  Vận Hành Zero Trust & Tiêu Chuẩn 2026
                </h2>
                <p className="text-[#405349] max-w-2xl text-sm sm:text-base">
                  Tích hợp 15 bước rà soát kỹ thuật đảm bảo Hệ thống Tốc độ cao, Tuân thủ Pháp lý & Bảo mật tuyệt đối.
                </p>
              </div>

              <button
                onClick={() => setChecklistOpen(true)}
                className="btn-primary-action px-6 py-3.5 rounded-2xl font-bold text-sm shadow-glow-primary shrink-0 flex items-center gap-2 font-heading"
              >
                <span>Xem Toàn Bộ 15 Bước Kiểm Tra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bento Grid for Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Speed & SEO */}
              <div className="bento-card p-8 lg:col-span-2 bg-[#FFFFFF]">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-heading font-bold text-[#2D4A3E] flex items-center gap-2">
                    <Zap className="text-[#D4A373] w-6 h-6" /> Core Web Vitals & AI SEO
                  </h3>
                  <span className="bg-[#2D4A3E]/10 text-[#2D4A3E] text-xs px-2.5 py-1 rounded-md font-bold font-mono">
                    LCP &lt; 2.5s
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#405349] mb-4 leading-relaxed">
                      Đạt điểm xanh (95-100) trên Google PageSpeed Insights. Cấu trúc JSON-LD & RAG
                      Compatibility tối ưu cho hệ thống AI Search (Gemini, ChatGPT Search).
                    </p>
                    <ul className="text-xs text-[#405349] space-y-2.5">
                      <li className="flex items-center gap-2">
                        <Check className="text-[#2D4A3E] w-4 h-4" /> Định dạng ảnh AVIF/WebP hiện đại & Multi-CDN.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="text-[#2D4A3E] w-4 h-4" /> Tự động sinh Sitemap XML 45.000+ hoạt chất.
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="text-[#2D4A3E] w-4 h-4" /> Sẵn sàng PWA tra cứu offline khi mất mạng.
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#2D4A3E]/10 flex flex-col justify-center text-center">
                    <div className="text-5xl font-heading font-extrabold text-[#2D4A3E] tabular-nums mb-1">
                      98
                    </div>
                    <p className="text-xs text-[#2D4A3E] font-bold font-heading">Google PageSpeed Score</p>
                    <p className="text-[11px] text-[#8F9E8B] mt-1">Đo lường trên thiết bị di động thực tế</p>
                  </div>
                </div>
              </div>

              {/* Zero Trust Security */}
              <div className="bento-card overflow-hidden group border-[#2D4A3E]/10 hover:border-[#2D4A3E]/30 bg-[#FFFFFF] flex flex-col justify-between">
                <div className="h-32 w-full overflow-hidden relative bg-[#EAE6DE]">
                  <img
                    src={IMG_ZERO_TRUST}
                    alt="Hạ tầng Zero Trust an ninh dữ liệu"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                  <span className="absolute top-3 left-3 bg-[#2D4A3E] text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                    NIST SP 800-207
                  </span>
                </div>
                <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="text-[#2D4A3E] w-6 h-6 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-heading font-bold text-[#2D4A3E]">Zero Trust Security</h3>
                    </div>
                    <p className="text-xs text-[#405349] mb-4 leading-relaxed">
                      Hạ tầng Containerization cô lập microservices, quét lỗ hổng liên tục theo tiêu chuẩn NIST.
                    </p>
                  </div>
                  <ul className="text-xs text-[#405349] space-y-2 pt-2 border-t border-[#2D4A3E]/10">
                    <li className="flex items-center gap-2">
                      <Check className="text-[#2D4A3E] w-4 h-4" /> HTTPS / TLS 1.3 & HSTS Preload
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-[#2D4A3E] w-4 h-4" /> Xác thực Đa yếu tố (MFA) & RBAC
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-[#2D4A3E] w-4 h-4" /> AI-Powered WAF chống Bot Scraping
                    </li>
                  </ul>
                </div>
              </div>

              {/* Legal Tech */}
              <div className="bento-card overflow-hidden bg-[#FFFFFF] flex flex-col justify-between">
                <div className="h-32 w-full overflow-hidden relative bg-[#EAE6DE]">
                  <img
                    src={IMG_LEGAL_TECH}
                    alt="Tuân thủ pháp lý Nghị định 13 bảo vệ dữ liệu"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                  <span className="absolute top-3 left-3 bg-[#D4A373] text-[#2D4A3E] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                    NĐ 13/2023 & GDPR
                  </span>
                </div>
                <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="text-[#D4A373] w-6 h-6" />
                      <h3 className="text-xl font-heading font-bold text-[#2D4A3E]">Pháp Lý (Legal Tech)</h3>
                    </div>
                    <p className="text-xs text-[#405349] leading-relaxed mb-4">
                      Tuân thủ Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam và chuẩn GDPR về bảo vệ dữ liệu cá nhân. Cơ chế đồng ý Cookie minh bạch.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#2D4A3E]/10 flex items-center justify-between">
                    <span className="text-[11px] text-[#2D4A3E] font-bold">Quyền được quên (Right to Erasure)</span>
                    <span className="text-[10px] text-[#8F9E8B]">100% Audit Trail</span>
                  </div>
                </div>
              </div>

              {/* NIST Incremental Backup */}
              <div className="bento-card p-8 lg:col-span-2 bg-[#FFFFFF]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4A373]/15 flex items-center justify-center shrink-0 border border-[#D4A373]/25 text-[#D4A373]">
                    <CloudCog className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-[#2D4A3E] mb-2">
                      Sao Lưu & Ứng Phó Sự Cố (NIST SP 800-34)
                    </h3>
                    <p className="text-xs md:text-sm text-[#405349] leading-relaxed">
                      Chiến lược Incremental Backup (Off-site) theo quy tắc 3-2-1. Hệ thống giám sát tự
                      động phát hiện lỗi 5xx báo cáo qua Telegram và PagerDuty. Kế hoạch Restoration
                      Test định kỳ đảm bảo khôi phục dữ liệu RTO &lt; 30 phút, loại bỏ rủi ro Ransomware.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S11: ĐỘI NGŨ & QUẢN TRỊ                                      */}
        {/* ============================================================ */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#D4A373] uppercase tracking-widest block mb-2 font-heading">
              Bộ máy vận hành
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#2D4A3E] mb-4">
              Nền Tảng Quản Trị Doanh Nghiệp
            </h2>
            <p className="text-[#405349] max-w-2xl mx-auto text-sm sm:text-base">
              Sự kết hợp hoàn hảo giữa 3 khối trụ cột: Nghiên cứu y khoa & AI, Tiếp thị tăng trưởng và Quản trị tài chính minh bạch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Science & AI Pillar */}
            <div className="bento-card overflow-hidden bg-[#FFFFFF] border-t-4 border-t-[#2D4A3E] group flex flex-col justify-between">
              <div className="h-36 w-full overflow-hidden relative bg-[#EAE6DE]">
                <img
                  src={IMG_INGREDIENT_LAB}
                  alt="Khối Y Khoa và Trí tuệ Nhân tạo CosmeticCheck"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#2D4A3E] text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                  Khoa Học & AI
                </span>
              </div>
              <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Microscope className="text-[#2D4A3E] w-6 h-6" />
                    <h4 className="text-[#2D4A3E] font-bold text-xl font-heading">Khối Y Khoa & AI</h4>
                  </div>
                  <p className="text-xs text-[#405349] leading-relaxed mb-4">
                    Chịu trách nhiệm bóc tách bảng thành phần, chuẩn hóa cơ sở dữ liệu Encyclopedia 45.000+ hóa chất, thẩm định tương tác dược mỹ phẩm và bảo mật dữ liệu.
                  </p>
                </div>
                <div className="text-xs text-[#2D4A3E] font-mono font-bold pt-2 border-t border-[#2D4A3E]/10">
                  KPI: SLA 99.95% · Precision 99.8%
                </div>
              </div>
            </div>

            {/* Marketing Pillar */}
            <div className="bento-card overflow-hidden bg-[#FFFFFF] border-t-4 border-t-[#D4A373] group flex flex-col justify-between">
              <div className="h-36 w-full overflow-hidden relative bg-[#EAE6DE]">
                <img
                  src={IMG_MARKETING_GROWTH}
                  alt="Khối Tiếp Thị và Tăng Trưởng - Sáng tạo nội dung video và phát triển cộng đồng"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#D4A373] text-[#2D4A3E] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                  Growth & Community
                </span>
              </div>
              <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="text-[#D4A373] w-6 h-6" />
                    <h4 className="text-[#2D4A3E] font-bold text-xl font-heading">Khối Tiếp Thị & Tăng Trưởng</h4>
                  </div>
                  <p className="text-xs text-[#405349] leading-relaxed mb-4">
                    Xây dựng nội dung giáo dục người tiêu dùng trên TikTok, SEO Website chuẩn y khoa, kết nối
                    hợp tác cùng các bác sĩ da liễu và triển khai chiến dịch truyền thông đa kênh.
                  </p>
                </div>
                <div className="text-xs text-[#D4A373] font-mono font-bold pt-2 border-t border-[#2D4A3E]/10">
                  KPI: 150.000 MAU sau 6 tháng
                </div>
              </div>
            </div>

            {/* Finance Pillar */}
            <div className="bento-card overflow-hidden bg-[#FFFFFF] border-t-4 border-t-[#8F9E8B] group flex flex-col justify-between">
              <div className="h-36 w-full overflow-hidden relative bg-[#EAE6DE]">
                <img
                  src={IMG_FINANCE_GOVERNANCE}
                  alt="Khối Tài Chính và Quản Trị Pháp Lý - Dòng tiền và báo cáo kiểm toán"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#8F9E8B] text-[#1F2E27] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                  Tài Chính & Pháp Chế
                </span>
              </div>
              <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="text-[#8F9E8B] w-6 h-6" />
                    <h4 className="text-[#2D4A3E] font-bold text-xl font-heading">Khối Tài Chính & Pháp Lý</h4>
                  </div>
                  <p className="text-xs text-[#405349] leading-relaxed mb-4">
                    Kiểm soát dòng tiền, tối ưu hóa doanh thu Affiliate & Thuê bao Freemium, quản lý hợp đồng
                    B2B và đảm bảo tuân thủ đầy đủ quy định pháp luật Việt Nam.
                  </p>
                </div>
                <div className="text-xs text-[#8F9E8B] font-mono font-bold pt-2 border-t border-[#2D4A3E]/10">
                  KPI: Điểm hòa vốn sau 14 tháng
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* S12: QUẢN TRỊ RỦI RO & KẾT LUẬN                              */}
        {/* ============================================================ */}
        <section className="py-24 bg-[#EFECE6]/50 border-t border-[#2D4A3E]/10">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFFFFF] border border-[#2D4A3E]/20 shadow-sm mb-6 relative">
              <div
                className="absolute inset-0 rounded-full border border-[#D4A373]/50 animate-ping"
                style={{ animationDuration: "3s" }}
              />
              <ShieldCheck className="text-[#2D4A3E] w-8 h-8 relative z-10" />
            </div>

            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#2D4A3E] mb-5">
              Sẵn Sàng Triển Khai Thực Nghiệm
            </h2>

            <p className="text-[#405349] text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              Bản kế hoạch kinh doanh và kiến trúc kỹ thuật đã được rà soát chặt chẽ. Hệ thống quản trị
              rủi ro được thiết lập từ đầu vào tài chính, bảo vệ tài sản trí tuệ đến ứng phó sự cố công
              nghệ. CosmeticCheck.vn tự tin kiến tạo giá trị thực cho người dùng và giải quyết triệt để
              "nỗi đau" trên thị trường làm đẹp.
            </p>

            {/* Featured Showcase Card for Transparency and Healing in S12 */}
            <div className="mb-10 bento-card p-6 md:p-8 bg-[#FFFFFF] border border-[#2D4A3E]/15 rounded-3xl overflow-hidden relative shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-left">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-heading">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" /> Minh Bạch & Chữa Lành
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-heading text-[#2D4A3E]">
                    Cam Kết Bảo Vệ & Phục Hồi Làn Da 2026
                  </h3>
                  <p className="text-xs sm:text-sm text-[#405349] leading-relaxed">
                    Mọi thuật toán phân tích đều dựa trên nguyên lý tôn trọng cấu trúc tự nhiên của màng tế bào da. Tuyệt đối không thoả hiệp với các thành phần độc hại, đem lại sự an tâm tuyệt đối cho mẹ bầu, phụ nữ mang thai và người dùng có làn da nhạy cảm nhất.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-[#F7F5F0] border border-[#2D4A3E]/10">
                      <span className="text-[10px] text-[#8F9E8B] block font-heading">Mẹ bầu & Thuần chay</span>
                      <span className="text-xs font-bold text-[#2D4A3E]">An Toàn 100%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7F5F0] border border-[#2D4A3E]/10">
                      <span className="text-[10px] text-[#8F9E8B] block font-heading">Thành phần bóc tách</span>
                      <span className="text-xs font-bold text-[#D4A373]">45.000+ Hoạt chất</span>
                    </div>
                  </div>
                </div>
                <div className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#2D4A3E]/10 relative shadow-sm">
                  <img
                    src={UNSPLASH_COMMUNITY_CARE}
                    alt="Minh bạch thành phần và phục hồi màng bảo vệ da"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A3E]/75 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold font-heading">
                      Tiêu chuẩn Y Khoa & Dược Mỹ Phẩm Bền Vững
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setSummaryOpen(true)}
                className="btn-primary-action px-8 py-4 rounded-2xl font-bold text-base shadow-glow-primary inline-flex items-center gap-2 group font-heading"
              >
                <span>Xem & Tải Toàn Bộ Kế Hoạch (PDF)</span>
                <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => handleTriggerAnalysis(searchQuery || onPageInciInput)}
                className="px-8 py-4 rounded-2xl bg-[#FFFFFF] border border-[#2D4A3E]/20 text-[#2D4A3E] font-bold text-base hover:bg-[#2D4A3E] hover:text-[#F7F5F0] transition-all duration-300 shadow-sm font-heading"
              >
                Phân tích thành phần
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* FOOTER (Rừng già & Đất ấm)                                   */}
      {/* ============================================================ */}
      <footer className="bg-[#FFFFFF] border-t border-[#2D4A3E]/10 py-12 px-6 text-xs text-[#8F9E8B] font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#2D4A3E] flex items-center justify-center text-[#D4A373]">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading text-base font-bold text-[#2D4A3E]">
              CosmeticCheck.vn
            </span>
          </div>

          <p className="text-center md:text-left text-[#405349]">
            &copy; 2026 CosmeticCheck.vn. Bảo lưu mọi quyền. Tài liệu vận hành kỹ thuật và kế hoạch phát triển kinh doanh bền vững.
          </p>

          <div className="flex items-center gap-6 text-[#405349] flex-wrap justify-center">
            <button
              onClick={() => setSavedModalOpen(true)}
              className="hover:text-[#2D4A3E] transition-colors font-semibold"
            >
              Sản phẩm đã lưu
            </button>
            <button
              onClick={() => setChecklistOpen(true)}
              className="hover:text-[#2D4A3E] transition-colors font-semibold"
            >
              15 Bước Kỹ thuật
            </button>
            <button
              onClick={() => setSummaryOpen(true)}
              className="hover:text-[#2D4A3E] transition-colors font-semibold"
            >
              Bản tóm tắt
            </button>
            <button
              onClick={() => scrollToSection("s1")}
              className="hover:text-[#2D4A3E] transition-colors font-semibold"
            >
              Lên đầu trang
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IngredientAnalyzerModal
        isOpen={analyzerOpen}
        onClose={() => setAnalyzerOpen(false)}
        initialQuery={searchQuery || onPageInciInput}
        syncText={searchQuery || onPageInciInput}
        onSyncTextChange={handleSyncSearchAndInci}
        onOpenSavedModal={() => setSavedModalOpen(true)}
      />

      <SavedProductsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        onSelectProduct={(text) => {
          handleSyncSearchAndInci(text);
          setAnalyzerOpen(true);
        }}
      />

      <ChecklistModal
        isOpen={checklistOpen}
        onClose={() => setChecklistOpen(false)}
      />

      <ExecutiveSummaryModal
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
      />
    </div>
  );
}
