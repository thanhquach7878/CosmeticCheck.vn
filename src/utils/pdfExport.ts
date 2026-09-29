import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Ingredient } from "../data/cosmeticsData";

export interface AnalysisReportData {
  productName: string;
  totalScore: number;
  pregnancySafe: boolean;
  maxComedogenic: number;
  maxIrritancy: number;
  safeCount: number;
  cautionCount: number;
  highRiskCount: number;
  ingredients: {
    raw: string;
    info: Ingredient;
  }[];
  externalCount?: number;
  rawText?: string;
}

/**
 * Generates and downloads a high-resolution, beautifully formatted PDF report
 * of the cosmetic ingredient analysis.
 */
export async function generateAnalysisPDF(data: AnalysisReportData): Promise<void> {
  const {
    productName,
    totalScore,
    pregnancySafe,
    maxComedogenic,
    maxIrritancy,
    safeCount,
    cautionCount,
    highRiskCount,
    ingredients,
    externalCount = 0
  } = data;

  const totalIngredients = ingredients.length;
  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const timeStr = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const reportId = `CC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  // Determine safety assessment label
  const safetyRating =
    totalScore >= 85
      ? "Rất An Toàn & Lành Tính"
      : totalScore >= 70
      ? "An Toàn Trung Bình"
      : totalScore >= 50
      ? "Cần Thận Trọng"
      : "Nguy Cơ Kích Ứng Cao";

  const safetyColor =
    totalScore >= 80 ? "#2D4A3E" : totalScore >= 60 ? "#B87D43" : "#DC2626";

  // Create temporary container for PDF rendering
  const printContainer = document.createElement("div");
  printContainer.id = "pdf-report-render-target";
  printContainer.style.position = "fixed";
  printContainer.style.top = "-9999px";
  printContainer.style.left = "-9999px";
  printContainer.style.width = "820px";
  printContainer.style.backgroundColor = "#FFFFFF";
  printContainer.style.color = "#1F2E27";
  printContainer.style.fontFamily =
    "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  printContainer.style.padding = "40px 45px";
  printContainer.style.boxSizing = "border-box";
  printContainer.style.zIndex = "-1000";

  // Build HTML Content
  printContainer.innerHTML = `
    <div style="max-width: 730px; margin: 0 auto; color: #1F2E27; font-size: 12px; line-height: 1.5;">
      <!-- Report Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2D4A3E; padding-bottom: 18px; margin-bottom: 22px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <div style="width: 28px; height: 28px; border-radius: 8px; background: #2D4A3E; display: flex; align-items: center; justify-content: center; color: #F7F5F0; font-weight: bold; font-size: 16px;">
              🌿
            </div>
            <span style="font-size: 20px; font-weight: 800; color: #2D4A3E; letter-spacing: -0.5px; font-family: 'Montserrat', sans-serif;">
              CosmeticCheck<span style="color: #D4A373;">.vn</span>
            </span>
          </div>
          <p style="margin: 0; font-size: 11px; color: #6B7C72; font-weight: 600;">
            Hệ Thống Thẩm Định Bảng Thành Phần Mỹ Phẩm Chuẩn Y Khoa & AI
          </p>
          <p style="margin: 2px 0 0 0; font-size: 10px; color: #8F9E8B;">
            Tiêu chuẩn EWG Skin Deep 2026 · Encyclopedia of Ingredients (Janssen Cosmetics)
          </p>
        </div>

        <div style="text-align: right;">
          <div style="display: inline-block; background: #F4F6F4; border: 1px solid #D1DDD6; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #2D4A3E; font-family: monospace;">
            MÃ HỒ SƠ: ${reportId}
          </div>
          <p style="margin: 6px 0 0 0; font-size: 10px; color: #6B7C72;">
            Ngày phân tích: <strong>${dateStr}</strong>
          </p>
          <p style="margin: 2px 0 0 0; font-size: 10px; color: #8F9E8B;">
            Thời gian: ${timeStr} · Bản quyền CosmeticCheck.vn
          </p>
        </div>
      </div>

      <!-- Report Title & Product Target -->
      <div style="background: #F7F9F7; border: 1px solid #D5E0D9; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #D4A373;">
              BÁO CÁO KẾT QUẢ ĐÁNH GIÁ ĐỘ LÀNH TÍNH
            </span>
            <h1 style="margin: 3px 0 0 0; font-size: 18px; font-weight: 800; color: #2D4A3E; font-family: 'Montserrat', sans-serif;">
              ${escapeHtml(productName || "Sản Phẩm Mỹ Phẩm")}
            </h1>
          </div>
          <div style="text-align: right;">
            <span style="background: #2D4A3E; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px;">
              ${totalIngredients} Hoạt chất phân tích
            </span>
          </div>
        </div>
      </div>

      <!-- Score Summary KPI Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <!-- Overall Safety Score -->
        <div style="background: #FFFFFF; border: 1.5px solid #2D4A3E; border-radius: 10px; padding: 14px; text-align: center;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7C72; text-transform: uppercase; margin-bottom: 4px;">
            Độ Lành Tính Tổng Thể
          </div>
          <div style="font-size: 26px; font-weight: 900; color: ${safetyColor}; font-family: 'Montserrat', sans-serif; line-height: 1;">
            ${totalScore}%
          </div>
          <div style="font-size: 10px; font-weight: 700; color: ${safetyColor}; margin-top: 4px;">
            ${safetyRating}
          </div>
        </div>

        <!-- Pregnancy Safety -->
        <div style="background: #FFFFFF; border: 1px solid #D5E0D9; border-radius: 10px; padding: 14px; text-align: center;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7C72; text-transform: uppercase; margin-bottom: 4px;">
            Phù Hợp Thai Kỳ
          </div>
          <div style="font-size: 16px; font-weight: 800; color: ${
            pregnancySafe ? "#15803D" : "#B91C1C"
          }; margin-top: 4px;">
            ${pregnancySafe ? "✓ Mẹ Bầu An Tâm" : "✕ Cần Tránh"}
          </div>
          <div style="font-size: 10px; color: #6B7C72; margin-top: 4px;">
            ${pregnancySafe ? "Không chứa retinoid / acid mạnh" : "Có hoạt chất lưu ý thai kỳ"}
          </div>
        </div>

        <!-- Comedogenic Rating -->
        <div style="background: #FFFFFF; border: 1px solid #D5E0D9; border-radius: 10px; padding: 14px; text-align: center;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7C72; text-transform: uppercase; margin-bottom: 4px;">
            Nguy Cơ Bít Tắc
          </div>
          <div style="font-size: 22px; font-weight: 800; color: #D4A373; font-family: 'Montserrat', sans-serif; line-height: 1.2;">
            ${maxComedogenic}<span style="font-size: 13px; font-weight: 500; color: #8F9E8B;">/5</span>
          </div>
          <div style="font-size: 10px; color: #6B7C72; margin-top: 4px;">
            ${maxComedogenic <= 1 ? "Cực thấp (Non-comedogenic)" : maxComedogenic <= 2 ? "Trung bình nhẹ" : "Dễ gây mụn ẩn"}
          </div>
        </div>

        <!-- Irritancy Rating -->
        <div style="background: #FFFFFF; border: 1px solid #D5E0D9; border-radius: 10px; padding: 14px; text-align: center;">
          <div style="font-size: 10px; font-weight: 700; color: #6B7C72; text-transform: uppercase; margin-bottom: 4px;">
            Nguy Cơ Kích Ứng
          </div>
          <div style="font-size: 22px; font-weight: 800; color: #405349; font-family: 'Montserrat', sans-serif; line-height: 1.2;">
            ${maxIrritancy}<span style="font-size: 13px; font-weight: 500; color: #8F9E8B;">/5</span>
          </div>
          <div style="font-size: 10px; color: #6B7C72; margin-top: 4px;">
            ${maxIrritancy <= 1 ? "Êm dịu với da nhạy cảm" : "Nên thử trước ở góc hàm"}
          </div>
        </div>
      </div>

      <!-- EWG Spectrum Bar Distribution -->
      <div style="background: #FFFFFF; border: 1px solid #D5E0D9; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 11px; font-weight: 700; color: #2D4A3E;">
            Phổ Phân Bổ Mức Độ An Toàn EWG Skin Deep (${totalIngredients} chất):
          </span>
          <div style="display: flex; gap: 14px; font-size: 10px; font-weight: 600;">
            <span style="color: #047857;">● EWG 1-2 (Lành tính): <strong>${safeCount}</strong></span>
            <span style="color: #B45309;">● EWG 3-6 (Lưu ý): <strong>${cautionCount}</strong></span>
            <span style="color: #B91C1C;">● EWG 7-10 (Cảnh báo): <strong>${highRiskCount}</strong></span>
          </div>
        </div>
        <div style="width: 100%; height: 10px; background: #E2E8F0; border-radius: 6px; overflow: hidden; display: flex;">
          <div style="width: ${
            totalIngredients > 0 ? (safeCount / totalIngredients) * 100 : 0
          }%; background: #059669; height: 100%;"></div>
          <div style="width: ${
            totalIngredients > 0 ? (cautionCount / totalIngredients) * 100 : 0
          }%; background: #F59E0B; height: 100%;"></div>
          <div style="width: ${
            totalIngredients > 0 ? (highRiskCount / totalIngredients) * 100 : 0
          }%; background: #DC2626; height: 100%;"></div>
        </div>
      </div>

      <!-- Detailed Ingredients Table -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h2 style="margin: 0; font-size: 13px; font-weight: 800; color: #2D4A3E; text-transform: uppercase; font-family: 'Montserrat', sans-serif;">
            Bảng Đánh Giá Chi Tiết Từng Thành Phần (INCI Order)
          </h2>
          <span style="font-size: 10px; color: #8F9E8B;">
            ${externalCount > 0 ? `Đã kích hoạt AI mở rộng (${externalCount} chất ngoài danh mục gốc)` : "Dữ liệu đối soát Janssen & EWG"}
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; text-align: left;">
          <thead>
            <tr style="background: #2D4A3E; color: #FFFFFF;">
              <th style="padding: 7px 8px; border: 1px solid #2D4A3E; width: 28px; text-align: center;">STT</th>
              <th style="padding: 7px 10px; border: 1px solid #2D4A3E; width: 190px;">Tên Hoạt Chất (INCI)</th>
              <th style="padding: 7px 8px; border: 1px solid #2D4A3E; width: 70px; text-align: center;">Điểm EWG</th>
              <th style="padding: 7px 10px; border: 1px solid #2D4A3E; width: 100px;">Nhóm Chức Năng</th>
              <th style="padding: 7px 10px; border: 1px solid #2D4A3E;">Mô Tả & Công Dụng Y Khoa</th>
              <th style="padding: 7px 8px; border: 1px solid #2D4A3E; width: 75px; text-align: center;">Chỉ Số Khác</th>
            </tr>
          </thead>
          <tbody>
            ${ingredients
              .map(({ info }, idx) => {
                const ewg = info.ewgScore;
                const isSafe = ewg <= 2;
                const isCaution = ewg >= 3 && ewg <= 6;
                const isDanger = ewg >= 7;

                const ewgBg = isSafe
                  ? "#DEF7EC"
                  : isCaution
                  ? "#FEF3C7"
                  : "#FEE2E2";
                const ewgText = isSafe
                  ? "#03543F"
                  : isCaution
                  ? "#92400E"
                  : "#991B1B";
                const ewgBorder = isSafe
                  ? "#84E1BC"
                  : isCaution
                  ? "#FCD34D"
                  : "#F87171";

                const rowBg = idx % 2 === 0 ? "#FFFFFF" : "#F9FAF9";

                return `
                <tr style="background: ${rowBg}; page-break-inside: avoid;">
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center; font-weight: bold; color: #6B7C72;">
                    ${idx + 1}
                  </td>
                  <td style="padding: 6px 10px; border: 1px solid #E5E7EB;">
                    <div style="font-weight: 700; color: #1F2E27; font-size: 11px;">
                      ${escapeHtml(info.name)}
                    </div>
                    <div style="font-size: 9.5px; color: #6B7C72; margin-top: 1px;">
                      ${escapeHtml(info.vietnameseName)}
                    </div>
                    ${
                      info.folia
                        ? `<span style="display: inline-block; font-size: 8.5px; background: #EAEFEA; color: #2D4A3E; padding: 1px 4px; border-radius: 3px; font-weight: 700; font-family: monospace; margin-top: 2px;">${escapeHtml(
                            info.folia
                          )}</span>`
                        : ""
                    }
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center;">
                    <span style="display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 800; background: ${ewgBg}; color: ${ewgText}; border: 1px solid ${ewgBorder};">
                      EWG ${ewg}
                    </span>
                    <div style="font-size: 8.5px; color: ${ewgText}; margin-top: 2px; font-weight: 600;">
                      ${isSafe ? "An toàn" : isCaution ? "Cần lưu ý" : "Cảnh báo"}
                    </div>
                  </td>
                  <td style="padding: 6px 10px; border: 1px solid #E5E7EB; font-size: 10px; color: #405349;">
                    <div style="font-weight: 600;">${escapeHtml(info.category)}</div>
                    <div style="font-size: 9px; color: #8F9E8B;">${escapeHtml(info.function)}</div>
                  </td>
                  <td style="padding: 6px 10px; border: 1px solid #E5E7EB; color: #4B5563; font-size: 10px; line-height: 1.4;">
                    ${escapeHtml(info.description)}
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center; font-size: 9px; color: #4B5563;">
                    <div>Bít tắc: <strong>${info.comedogenic}/5</strong></div>
                    <div>Kích ứng: <strong>${info.irritancy}/5</strong></div>
                    <div style="margin-top: 2px; font-weight: 700; color: ${
                      info.pregnancySafe ? "#059669" : "#DC2626"
                    };">
                      ${info.pregnancySafe ? "✓ Mẹ bầu OK" : "⚠ Tránh bầu"}
                    </div>
                  </td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- Legal / Medical Disclaimer & Certification Footer -->
      <div style="border-top: 1.5px solid #2D4A3E; padding-top: 14px; margin-top: 10px; display: flex; justify-content: space-between; align-items: flex-start; font-size: 9.5px; color: #6B7C72;">
        <div style="max-width: 530px; line-height: 1.45;">
          <p style="margin: 0 0 4px 0; font-weight: 700; color: #2D4A3E;">
            TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM & CƠ SỞ KHOA HỌC:
          </p>
          <p style="margin: 0 0 3px 0;">
            1. Báo cáo này được tự động trích xuất bởi CosmeticCheck.vn dựa trên tiêu chuẩn dữ liệu mở EWG Skin Deep 2026, cơ sở dữ liệu Janssen Cosmetics Encyclopedia of Ingredients và Khung phân tích hóa mỹ phẩm mở rộng.
          </p>
          <p style="margin: 0;">
            2. Kết quả mang tính chất tham khảo khoa học, không thay thế chẩn đoán hoặc chỉ định trực tiếp từ Bác sĩ Chuyên khoa Da liễu.
          </p>
        </div>

        <div style="text-align: right; border-left: 1px solid #D5E0D9; padding-left: 14px;">
          <div style="font-weight: 800; color: #2D4A3E; font-size: 11px;">
            COSMETICCHECK.VN
          </div>
          <div style="color: #D4A373; font-weight: 700; font-size: 9px;">
            ★ VERIFIED CLINICAL AUDIT ★
          </div>
          <div style="color: #8F9E8B; font-size: 8.5px; margin-top: 2px;">
            Nền tảng Y tế Số & An toàn Da liễu
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(printContainer);

  try {
    // Render HTML to canvas with high resolution
    const canvas = await html2canvas(printContainer, {
      scale: 2, // 2x DPI for ultra crisp typography and charts
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      windowWidth: 820
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    // Initialize A4 PDF: 210 x 297 mm
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    // Calculate height of the image on the PDF page
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      // Fits on a single page
      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight, undefined, "FAST");
    } else {
      // Multiple pages: split gracefully
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }
    }

    // Sanitize file name for download
    const cleanProductName = (productName || "san-pham")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const fileName = `CosmeticCheck-Bao-Cao-${cleanProductName || "phan-tich"}.pdf`;

    pdf.save(fileName);
  } finally {
    // Always clean up DOM element
    if (document.body.contains(printContainer)) {
      document.body.removeChild(printContainer);
    }
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
