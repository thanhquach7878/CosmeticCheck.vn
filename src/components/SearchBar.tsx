import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Sparkles, BookOpen } from "lucide-react";
import { INGREDIENT_DICTIONARY, Ingredient } from "../data/cosmeticsData";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  variant?: "header" | "hero";
  className?: string;
  showSyncBadge?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm hoạt chất, thương hiệu hoặc dán bảng INCI...",
  variant = "hero",
  className = "",
  showSyncBadge = false
}: SearchBarProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter autocomplete suggestions from INGREDIENT_DICTIONARY (matches 2+ chars)
  const suggestions: Ingredient[] = useMemo(() => {
    if (!value || value.trim().length < 2) return [];
    // If the input is a long comma-separated list, search by the last item
    const tokens = value.split(/[,;\n•/]+/);
    const lastToken = tokens[tokens.length - 1].trim().toLowerCase();
    const query = lastToken.length >= 2 ? lastToken : value.toLowerCase().trim();

    const all = Object.values(INGREDIENT_DICTIONARY);
    return all
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.vietnameseName.toLowerCase().includes(query) ||
          (item.folia && item.folia.toLowerCase().includes(query)) ||
          item.function.toLowerCase().includes(query)
        );
      })
      .slice(0, 6);
  }, [value]);

  const handleSelectSuggestion = (item: Ingredient) => {
    // If multiple ingredients existed, append or replace
    if (value.includes(",")) {
      const tokens = value.split(/[,;\n•/]+/);
      tokens[tokens.length - 1] = " " + item.name;
      const combined = tokens.join(", ").trim();
      onChange(combined);
      onSearch(combined);
    } else {
      onChange(item.name);
      onSearch(item.name);
    }
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      onSearch(value);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  if (variant === "header") {
    return (
      <div ref={containerRef} className={`relative w-full ${className}`}>
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8F9E8B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              onChange(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#FFFFFF] border border-[#2D4A3E]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#1F2E27] placeholder-[#8F9E8B] focus:outline-none focus:border-[#2D4A3E] transition-all shadow-sm font-sans"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setShowDropdown(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#8F9E8B] hover:text-[#2D4A3E] rounded-md transition-colors"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-[#FFFFFF] border border-[#2D4A3E]/15 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in-50 duration-150 text-left">
            <div className="px-3.5 py-2 bg-[#F7F5F0] border-b border-[#2D4A3E]/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8F9E8B] uppercase tracking-wider font-heading flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-[#D4A373]" /> Gợi ý hoạt chất bách khoa:
              </span>
              <span className="text-[10px] text-[#405349]">Đồng bộ với INCI</span>
            </div>
            <div className="divide-y divide-[#2D4A3E]/5 max-h-64 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <button
                  key={item.name + idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#F7F5F0] transition-colors flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2D4A3E] group-hover:text-[#D4A373] truncate font-heading">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#8F9E8B] truncate">
                      {item.vietnameseName} {item.folia && `• ${item.folia}`}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                      item.ewgScore <= 2
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : item.ewgScore <= 6
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    EWG {item.ewgScore}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Hero Variant: Large prominient search bar with button and sync indicator
  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center bg-[#FFFFFF] border-2 border-[#2D4A3E]/20 hover:border-[#2D4A3E]/50 focus-within:border-[#2D4A3E] focus-within:ring-4 focus-within:ring-[#2D4A3E]/10 rounded-2xl p-1.5 shadow-lg transition-all">
        <div className="pl-3 sm:pl-4 pr-2 text-[#8F9E8B]">
          <Search className="w-5 h-5 text-[#2D4A3E]" />
        </div>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-xs sm:text-sm text-[#1F2E27] placeholder-[#8F9E8B] focus:outline-none font-sans py-2"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setShowDropdown(false);
            }}
            className="p-1 text-[#8F9E8B] hover:text-[#2D4A3E] rounded-md transition-colors mr-1"
            aria-label="Xóa từ khóa"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setShowDropdown(false);
            onSearch(value);
          }}
          className="btn-primary-action px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 font-heading"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Phân tích thành phần</span>
        </button>
      </div>

      {showSyncBadge && (
        <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-[#405349]">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Đồng bộ dữ liệu thời gian thực với Textarea phân tích INCI
          </span>
          <span className="text-[#8F9E8B]">Nhấn Enter hoặc nút xanh để phân tích</span>
        </div>
      )}

      {/* Hero Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-[#FFFFFF] border border-[#2D4A3E]/15 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150 text-left">
          <div className="px-4 py-2.5 bg-[#F7F5F0] border-b border-[#2D4A3E]/10 flex items-center justify-between">
            <span className="text-xs font-bold text-[#8F9E8B] uppercase tracking-wider font-heading flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#D4A373]" /> Gợi ý hoạt chất từ Bách khoa Toàn thư (Encyclopedia):
            </span>
            <span className="text-[11px] text-[#2D4A3E] font-medium">Bấm chọn để đồng bộ vào ô nhập</span>
          </div>

          <div className="divide-y divide-[#2D4A3E]/5 max-h-72 overflow-y-auto">
            {suggestions.map((item, idx) => (
              <button
                key={item.name + idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-4 py-3 hover:bg-[#F7F5F0] transition-colors flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#2D4A3E] group-hover:text-[#D4A373] font-heading">
                      {item.name}
                    </span>
                    {item.folia && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8F9E8B]/20 text-[#2D4A3E] font-mono">
                        {item.folia}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#405349] mt-0.5">
                    {item.vietnameseName} &bull; <span className="italic text-[#8F9E8B]">{item.function}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
                      item.ewgScore <= 2
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : item.ewgScore <= 6
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    EWG {item.ewgScore}
                  </span>
                  <div className="text-[10px] text-[#8F9E8B] mt-0.5">
                    {item.ewgScore <= 2 ? "Lành tính" : item.ewgScore <= 6 ? "Lưu ý" : "Cảnh báo"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
