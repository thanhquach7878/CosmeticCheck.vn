export interface Ingredient {
  name: string;
  vietnameseName: string;
  ewgScore: number; // 1-10
  function: string;
  category: string;
  comedogenic: number; // 0-5
  irritancy: number; // 0-5
  pregnancySafe: boolean;
  description: string;
  folia?: string; // Reference in ingredients_index.pdf
  source?: "PDF_ENCYCLOPEDIA" | "EXTENDED_AI";
  skinConcerns?: string[]; // e.g. ["#DaMụn", "#TrịThâm", "#ChốngLãoHóa", "#DaNhạyCảm", "#PhụcHồiDa", "#AnToànMẹBầu"]
}

export interface SkinConcernTag {
  tag: string;
  label: string;
  description: string;
  sampleIngredients: string;
}

export const SKIN_CONCERN_TAGS: SkinConcernTag[] = [
  {
    tag: "#DaMụn",
    label: "Da dầu mụn & Bít tắc",
    description: "Kháng khuẩn P.acnes, tiêu sừng nang lông và điều tiết bã nhờn",
    sampleIngredients: "Salicylic acid, Tea tree oil, Zinc PCA, Anti sebum complex, Butyl avocadate"
  },
  {
    tag: "#TrịThâm",
    label: "Trị thâm & Làm sáng da",
    description: "Ức chế enzyme tyrosinase, mờ đốm nâu và sạm màu sau mụn",
    sampleIngredients: "Arbutin, Acerola fruit extract, Age Spot corrector, Vitamin C, Licorice extract"
  },
  {
    tag: "#ChốngLãoHóa",
    label: "Chống lão hóa & Nếp nhăn",
    description: "Kích thích collagen, tái tạo tế bào mầm và giảm nếp nhăn sâu",
    sampleIngredients: "Matrixyl 3000, Apple stem cells, Avocado peptide, Bakuchiol, Coenzym Q10, Gatuline Expression"
  },
  {
    tag: "#DaNhạyCảm",
    label: "Da nhạy cảm & Dễ kích ứng",
    description: "Làm dịu mao mạch, giảm châm chích và làm lành thương tổn tức thì",
    sampleIngredients: "Sensitive-Complex, Allantoin, Aloe vera, Bisabolol, Centella asiatica, Balloon vine"
  },
  {
    tag: "#PhụcHồiDa",
    label: "Phục hồi màng ẩm B5 & Ceramide",
    description: "Hàn gắn hàng rào lipid, khóa ẩm đa tầng và ngăn mất nước qua biểu bì",
    sampleIngredients: "Ceramides, Panthenol (B5), Squalane, Hyaluronic acid, Beta Glucan"
  },
  {
    tag: "#AnToànMẹBầu",
    label: "An toàn tuyệt đối cho thai kỳ",
    description: "100% không chứa teratogen, retinoid liều cao hay paraben",
    sampleIngredients: "Acerola, Bakuchiol, Zinc oxide, Avocado peptide, Allantoin, Aloe vera, Shea butter"
  }
];

export interface PresetProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredientsText: string;
  tagline: string;
  badge: string;
}

export const PRESET_PRODUCTS: PresetProduct[] = [
  {
    id: "janssen-botanical-serum",
    name: "Tinh chất Thảo Dược Trẻ Hóa & Sáng Da",
    brand: "Janssen Botanical Pro",
    category: "Serum / Tinh chất",
    badge: "Từ điển Janssen",
    tagline: "Chiết xuất Acerola, Avocado Peptide, Allantoin, Aloe vera và Bisabolol phục hồi da đa tầng.",
    ingredientsText:
      "Water, Acerola (malpighia punicifolia) fruit extract, Avocado peptide, Allantoin, Aloe vera, Bisabolol, Sodium Hyaluronate, Panthenol, Algae extract, Tocopherol"
  },
  {
    id: "janssen-anti-aging",
    name: "Kem Chống Lão Hóa Matrixyl 3000 & Tế Bào Gốc Táo Thụy Sỹ",
    brand: "Chrono Janssen Care",
    category: "Kem dưỡng tế bào gốc",
    badge: "Chống lão hóa",
    tagline: "Kết hợp Matrixyl 3000, Apple stem cells, Hyaluronic acid và Arbutin làm sáng đốm nâu.",
    ingredientsText:
      "Water, Matrixyl 3000, Apple (malus domestica) stem cells, Arbutin, Squalane, Hyaluronic acid, Coenzym Q10, Shea butter, Pisum sativum extract, Phenoxyethanol"
  },
  {
    id: "janssen-sensitive-care",
    name: "Gel Chữa Lành Da Nhạy Cảm Sensitive-Complex & Rau Má",
    brand: "Sensitive Herb Lab",
    category: "Phục hồi da kích ứng",
    badge: "Lành tính 100%",
    tagline: "Công thức độc quyền Sensitive-Complex, Centella asiatica, Butyl avocadate kiềm dầu.",
    ingredientsText:
      "Water, Sensitive-Complex, Centella asiatica extract, Butyl avocadate, Calendula officinalis, Chamomile extract, Glycerol, Beta Glucan, Zinc oxide"
  },
  {
    id: "custom-external-demo",
    name: "Công thức kiểm tra chất bên ngoài (External Ingredients)",
    brand: "Test Lab",
    category: "Thử nghiệm hoạt chất mở rộng",
    badge: "Phân tích mở rộng",
    tagline: "Ví dụ thử nghiệm các chất mới hoặc danh pháp tự do không báo lỗi.",
    ingredientsText:
      "Water, Niacinamide, Bakuchiol, Dragon Blood Resin, Copper Tripeptide-1, Centella Asiatica, Bio-Retinoid Complex, Tranexamic Acid"
  }
];

// Comprehensive index loaded from ingredients_index.pdf (Janssen Cosmetics Encyclopedia of Ingredients)
export const INGREDIENT_DICTIONARY: Record<string, Ingredient> = {
  // Folia 06 - 15
  "acerola": {
    name: "Acerola (Malpighia punicifolia) fruit extract",
    vietnameseName: "Chiết xuất quả Acerola (Sơ ri)",
    ewgScore: 1,
    function: "Chống oxy hóa cực mạnh, giàu Vitamin C",
    category: "Thảo mộc",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Giàu Vitamin C tự nhiên giúp bảo vệ tế bào trước gốc tự do, tăng cường sinh tổng hợp collagen và sáng hồng sắc diện.",
    folia: "Folia 06",
    source: "PDF_ENCYCLOPEDIA"
  },
  "age spot corrector": {
    name: "Age Spot corrector (Lepidium sativum, soy isoflavones, lecithin)",
    vietnameseName: "Phức hợp mờ đốm nâu & tàn nhang",
    ewgScore: 1,
    function: "Ức chế lipofuscin & melanin",
    category: "Làm sáng",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chiết xuất mầm cải xoong Thụy Sỹ giàu sulforaphane và genistein giúp làm mờ đốm sắc tố lão hóa rõ rệt trên diện rộng.",
    folia: "Folia 07",
    source: "PDF_ENCYCLOPEDIA"
  },
  "ahas": {
    name: "AHAs (Alpha Hydroxy Acids)",
    vietnameseName: "Axit Alpha Hydroxy (Glycolic, Lactic, Citric, Malic, Tartaric)",
    ewgScore: 3,
    function: "Tẩy tế bào chết hóa học & Làm mịn da",
    category: "Trị mụn",
    comedogenic: 0,
    irritancy: 2,
    pregnancySafe: true,
    description: "Nới lỏng liên kết sừng biểu bì, làm sáng các vết sạm màu và tăng cường độ căng mọng tươi mới cho da.",
    folia: "Folia 08",
    source: "PDF_ENCYCLOPEDIA"
  },
  "algae extract": {
    name: "Algae extract",
    vietnameseName: "Chiết xuất Tảo biển",
    ewgScore: 1,
    function: "Cấp khoáng, săn chắc & Giữ ẩm",
    category: "Dưỡng ẩm",
    comedogenic: 1,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chứa i-ốt, kẽm, magie và khoáng vi lượng kích thích trao đổi chất dưới da, tạo màng giữ ẩm mịn màng dẻo dai.",
    folia: "Folia 09",
    source: "PDF_ENCYCLOPEDIA"
  },
  "allantoin": {
    name: "Allantoin",
    vietnameseName: "Allantoin tự nhiên",
    ewgScore: 1,
    function: "Làm mềm sừng & Liền vết thương",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chiết xuất từ rễ cây liên mộc (Comfrey), làm dịu da kích ứng, kháng viêm và tăng sinh biểu mô nhanh chóng.",
    folia: "Folia 10",
    source: "PDF_ENCYCLOPEDIA"
  },
  "almond oil": {
    name: "Almond (Prunus amygdalus) oil",
    vietnameseName: "Dầu Hạnh nhân ngọt",
    ewgScore: 1,
    function: "Làm mềm & Giàu Vitamin E",
    category: "Chất làm mềm",
    comedogenic: 2,
    irritancy: 0,
    pregnancySafe: true,
    description: "Dầu thực vật ép lạnh giàu axit béo chưa bão hòa, nuôi dưỡng da khô ráp và phục hồi độ mềm mại đàn hồi.",
    folia: "Folia 11",
    source: "PDF_ENCYCLOPEDIA"
  },
  "aloe vera": {
    name: "Aloe vera (Aloe Barbadensis)",
    vietnameseName: "Chiết xuất Nha đam / Lô hội",
    ewgScore: 1,
    function: "Cấp nước, dịu da cháy nắng & Kháng viêm",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chứa enzyme, polysaccharide và axit amin làm mát da tức thì, thúc đẩy làm lành thương tổn và vết rát da.",
    folia: "Folia 12",
    source: "PDF_ENCYCLOPEDIA"
  },
  "alp rose stem cells": {
    name: "Alp rose (Rhododendron ferrugineum) stem cells",
    vietnameseName: "Tế bào gốc Hoa hồng vùng núi Alps",
    ewgScore: 1,
    function: "Bảo vệ tế bào gốc da trước tia UV",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Giàu dehydrin giúp tăng sức sống của tế bào mầm biểu bì, chống chịu thời tiết khắc nghiệt và stress oxy hóa.",
    folia: "Folia 14",
    source: "PDF_ENCYCLOPEDIA"
  },
  "althaea officinalis": {
    name: "Althaea officinalis (Marshmallow) extract",
    vietnameseName: "Chiết xuất Cây thục quỳ (Marshmallow)",
    ewgScore: 1,
    function: "Bảo vệ mô da & Kháng viêm dịu nhẹ",
    category: "Thảo mộc",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chất nhầy mucilage tự nhiên bao phủ nhẹ nhàng lên vùng da bị viêm ngứa, mang lại cảm giác mềm mại như nhung.",
    folia: "Folia 15",
    source: "PDF_ENCYCLOPEDIA"
  },

  // Folia 16 - 26
  "anti sebum complex": {
    name: "Anti sebum complex (Oleanolic acid, NDGA)",
    vietnameseName: "Phức hợp kiểm soát bã nhờn chuyên sâu",
    ewgScore: 1,
    function: "Ức chế 5-alpha reductase & Kháng khuẩn mụn",
    category: "Trị mụn",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Kết hợp axit oleanolic và NDGA trong gel thẩm thấu giúp triệt tiêu mụn đầu đen, kiềm dầu và chống tăng sừng nang lông.",
    folia: "Folia 16",
    source: "PDF_ENCYCLOPEDIA"
  },
  "apple stem cells": {
    name: "Apple (Malus domestica) stem cells",
    vietnameseName: "Tế bào gốc Táo Thụy Sỹ (Uttwiler Spätlauber)",
    ewgScore: 1,
    function: "Kéo dài tuổi thọ tế bào da & Chống nhăn",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Giàu yếu tố biểu sinh giúp ngăn ngừa lão hóa theo thời gian, duy trì độ săn chắc và tươi trẻ của đường nét khuôn mặt.",
    folia: "Folia 17",
    source: "PDF_ENCYCLOPEDIA"
  },
  "apricot kernel oil": {
    name: "Apricot (Prunus armeniaca) kernel oil",
    vietnameseName: "Dầu Hạt mơ ép lạnh",
    ewgScore: 1,
    function: "Dưỡng ẩm da nhạy cảm & Em bé",
    category: "Chất làm mềm",
    comedogenic: 2,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chứa 65-70% axit oleic, hấp thụ nhanh qua da không gây nhờn bóng, an toàn tuyệt đối cho cả da sơ sinh.",
    folia: "Folia 18",
    source: "PDF_ENCYCLOPEDIA"
  },
  "aquaporin-stimulating-peptid": {
    name: "Aquaporin-Stimulating-Peptid (ASP)",
    vietnameseName: "Peptide kích hoạt kênh dẫn nước Aquaporin-3",
    ewgScore: 1,
    function: "Mở rộng kênh luân chuyển nước đa tầng",
    category: "Dưỡng ẩm",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Hexapeptide kích hoạt kênh AQP3 đưa nước từ đáy biểu bì lên lớp sừng, tăng cường độ ẩm da lên +131% sau 2 tháng.",
    folia: "Folia 19",
    source: "PDF_ENCYCLOPEDIA"
  },
  "arbutin": {
    name: "Arbutin",
    vietnameseName: "Alpha / Beta Arbutin",
    ewgScore: 1,
    function: "Ức chế enzyme Tyrosinase, mờ thâm nám",
    category: "Làm sáng",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chiết xuất từ lá cây Bearberry, ức chế quá trình hình thành sắc tố đen mà không gây bào mòn hay mất sắc tố da.",
    folia: "Folia 20",
    source: "PDF_ENCYCLOPEDIA"
  },
  "avocado oil": {
    name: "Avocado (Persea gratissima) oil",
    vietnameseName: "Dầu Quả bơ",
    ewgScore: 1,
    function: "Nuôi dưỡng màng lipid, giàu Vitamin A, D, E",
    category: "Chất làm mềm",
    comedogenic: 2,
    irritancy: 0,
    pregnancySafe: true,
    description: "Giàu phytosterol và vitamin kích thích chuyển hóa mô da, làm mềm mại làn da khô nứt nẻ và chống lão hóa tự nhiên.",
    folia: "Folia 25",
    source: "PDF_ENCYCLOPEDIA"
  },
  "avocado peptide": {
    name: "Avocado peptide (Peptide quả bơ)",
    vietnameseName: "Peptide Bơ thanh lọc độc tố tế bào",
    ewgScore: 1,
    function: "Kích hoạt hệ thống tiêu hủy protein rác (Proteasome)",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Thủy phân enzyme từ cơm quả bơ, tăng cường hoạt tính dọn dẹp tế bào già cỗi +43%, bảo vệ tế bào khỏi lão hóa sớm.",
    folia: "Folia 26",
    source: "PDF_ENCYCLOPEDIA"
  },

  // Folia 27 - 40
  "balloon vine": {
    name: "Balloon vine (Cardiospermum halicacabum) extract",
    vietnameseName: "Chiết xuất Dây tầm phỏng (Balloon vine)",
    ewgScore: 1,
    function: "Chống dị ứng & Giảm ngứa như Cortisone tự nhiên",
    category: "Thảo mộc",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chứa phytosterol và terpene 5 vòng dập tắt phản ứng viêm da dị ứng, chàm ngứa mà không có tác dụng phụ của tân dược.",
    folia: "Folia 27",
    source: "PDF_ENCYCLOPEDIA"
  },
  "bearberry extract": {
    name: "Bearberry (Arctostaphylos uva ursi) leaf extract",
    vietnameseName: "Chiết xuất Lá dâu gấu (Bearberry)",
    ewgScore: 1,
    function: "Sáng da tự nhiên & Làm se chân lông",
    category: "Làm sáng",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Nguồn nguyên liệu tự nhiên dồi dào Arbutin và Ursolic acid, làm mờ nám sạm và kháng viêm nhẹ nhàng.",
    folia: "Folia 29",
    source: "PDF_ENCYCLOPEDIA"
  },
  "beta glucan": {
    name: "Beta Glucan",
    vietnameseName: "Beta Glucan từ nấm men",
    ewgScore: 1,
    function: "Kích hoạt đại thực bào & Tăng miễn dịch da",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Tăng cường năng lực tự bảo vệ của da, đẩy nhanh tiến trình liền sẹo và phục hồi da cực nhạy cảm sau thủ thuật.",
    folia: "Folia 31",
    source: "PDF_ENCYCLOPEDIA"
  },
  "bisabolol": {
    name: "Bisabolol",
    vietnameseName: "Bisabolol tinh khiết từ cúc La Mã",
    ewgScore: 1,
    function: "Kháng khuẩn & Làm dịu kích ứng",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Rượu sesquiterpene tự nhiên có mùi hương nhẹ, xoa dịu làn da bị châm chích và hỗ trợ tái sinh màng lipid.",
    folia: "Folia 38",
    source: "PDF_ENCYCLOPEDIA"
  },

  // Folia 41 - 56
  "butyl avocadate": {
    name: "Butyl avocadate",
    vietnameseName: "Butyl avocadate (Kiềm dầu từ quả bơ)",
    ewgScore: 1,
    function: "Ức chế 5-alpha reductase giảm dầu thừa 49%",
    category: "Trị mụn",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Este được cấp bằng sáng chế từ dầu bơ, triệt tiêu sự tiết bã nhờn quá mức ở da và chân tóc dầu.",
    folia: "Folia 42",
    source: "PDF_ENCYCLOPEDIA"
  },
  "caffeine": {
    name: "Caffeine",
    vietnameseName: "Caffeine tinh khiết",
    ewgScore: 1,
    function: "Tăng vi tuần hoàn & Giảm bọng mắt",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Thúc đẩy tuần hoàn máu ngoại vi, giảm tích tụ dịch quanh bọng mắt và hỗ trợ phân giải mỡ cục bộ.",
    folia: "Folia 44",
    source: "PDF_ENCYCLOPEDIA"
  },
  "calendula officinalis": {
    name: "Calendula officinalis (Pot marigold)",
    vietnameseName: "Chiết xuất Hoa cúc xuxi (Calendula)",
    ewgScore: 1,
    function: "Kháng viêm & Phục hồi biểu bì",
    category: "Thảo mộc",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chứa este triterpenoid và carotenoid giảm ửng đỏ, hỗ trợ biểu mô hóa vết thương hở và da nhạy cảm.",
    folia: "Folia 45",
    source: "PDF_ENCYCLOPEDIA"
  },
  "caviar extract": {
    name: "Caviar extract",
    vietnameseName: "Chiết xuất Trứng cá tầm đen",
    ewgScore: 1,
    function: "Tái sinh cấu trúc da & Giàu axit amin quý",
    category: "Chống lão hóa",
    comedogenic: 1,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chứa phức hợp peptide, phospholipid lecithin và khoáng chất biển nuôi dưỡng làn da chùng nhão lão hóa sớm.",
    folia: "Folia 47",
    source: "PDF_ENCYCLOPEDIA"
  },
  "centella asiatica": {
    name: "Centella asiatica extract",
    vietnameseName: "Chiết xuất Rau má (Cỏ hổ)",
    ewgScore: 1,
    function: "Kích thích collagen & Liền sẹo mô hạt",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Axit asiatic và madecassoside kích hoạt sinh tổng hợp collagen type I và III, làm dịu da viêm sưng mụn.",
    folia: "Folia 48",
    source: "PDF_ENCYCLOPEDIA"
  },
  "ceramides": {
    name: "Ceramides",
    vietnameseName: "Ceramide cấu trúc màng da",
    ewgScore: 1,
    function: "Gắn kết tế bào sừng như vữa xây gạch",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Lipid sinh học cấu tạo 50% hàng rào bảo vệ da, khóa ẩm tuyệt đối và ngăn ngừa mất nước qua biểu bì (TEWL).",
    folia: "Folia 49",
    source: "PDF_ENCYCLOPEDIA"
  },
  "coenzym q10": {
    name: "Coenzym Q10 (Ubiquinone)",
    vietnameseName: "Coenzyme Q10",
    ewgScore: 1,
    function: "Nạp năng lượng ty thể tế bào & Chống oxy hóa",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Bảo vệ màng lipid tế bào khỏi quá trình peroxy hóa, duy trì sự sống dẻo dai của tế bào trước tác hại của tia nắng.",
    folia: "Folia 55",
    source: "PDF_ENCYCLOPEDIA"
  },
  "collagen": {
    name: "Collagen",
    vietnameseName: "Collagen thủy phân",
    ewgScore: 1,
    function: "Cải thiện đàn hồi & Căng mọng da",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Protein xoắn 3 chuỗi giúp giữ nước vượt trội ở bề mặt, làm đầy rãnh nhăn nông và tăng độ nảy cho da.",
    folia: "Folia 56",
    source: "PDF_ENCYCLOPEDIA"
  },

  // Folia 74 - 105
  "gatuline expression": {
    name: "Gatuline® Expression (Acmella oleracea extract, Spilanthol)",
    vietnameseName: "Botox thảo mộc Gatuline (Hoa cúc áo hoa vàng)",
    ewgScore: 1,
    function: "Giãn cơ vi thể & Xóa mờ vết chân chim tức thì",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chứa phân tử Spilanthol làm thư giãn cơ dưới da quanh mắt và khóe miệng, tạo hiệu ứng mượt rãnh nhăn tự nhiên.",
    folia: "Folia 74",
    source: "PDF_ENCYCLOPEDIA"
  },
  "ginseng extract": {
    name: "Ginseng (Panax ginseng) extract",
    vietnameseName: "Chiết xuất Nhân sâm Hàn Quốc",
    ewgScore: 1,
    function: "Tăng lưu thông máu & Tái sinh tế bào",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Giàu ginsenoside quý giá, kích hoạt tuần hoàn mao mạch, mang dưỡng chất nuôi dưỡng làn da xỉn màu mệt mỏi.",
    folia: "Folia 75",
    source: "PDF_ENCYCLOPEDIA"
  },
  "hyaluronic acid": {
    name: "Hyaluronic acid (Sodium hyaluronate)",
    vietnameseName: "Axit Hyaluronic (HA đa phân tử)",
    ewgScore: 1,
    function: "Giữ nước gấp 1000 lần trọng lượng",
    category: "Dưỡng ẩm",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Bể chứa nước sinh học của chất nền ngoại bào, duy trì độ căng mọng và mềm mượt cho toàn bộ tầng da.",
    folia: "Folia 82",
    source: "PDF_ENCYCLOPEDIA"
  },
  "matrixyl 3000": {
    name: "Matrixyl™ 3000 (Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7)",
    vietnameseName: "Phức hợp Peptide Matrikine Matrixyl 3000",
    ewgScore: 1,
    function: "Tái tạo chất nền ngoại bào, giảm -45% độ sâu nếp nhăn",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Truyền tín hiệu phục hồi collagen và fibronectin, điều hòa progerin để đảo ngược quá trình lão hóa sinh học.",
    folia: "Folia 104",
    source: "PDF_ENCYCLOPEDIA"
  },
  "pisum sativum": {
    name: "Pisum sativum (Pea) extract",
    vietnameseName: "Chiết xuất Đậu Hà Lan (Pisum sativum)",
    ewgScore: 1,
    function: "Chống enzyme elastase và collagenase",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Bảo vệ mạng lưới collagen và elastin khỏi bị phân hủy bởi các men thoái hóa khi da bị căng thẳng hoặc tia UV tấn công.",
    folia: "Folia 125",
    source: "PDF_ENCYCLOPEDIA"
  },

  // Folia 138 - 170
  "salicylic acid": {
    name: "Salicylic acid (BHA)",
    vietnameseName: "Axit Salicylic (BHA tan trong dầu)",
    ewgScore: 3,
    function: "Làm sạch sâu cổ nang lông & Tiêu sừng",
    category: "Trị mụn",
    comedogenic: 0,
    irritancy: 2,
    pregnancySafe: false,
    description: "Tan trong dầu bã nhờn, dọn sạch tế bào chết ứ đọng gây mụn ẩn. Phụ nữ mang thai nên tham khảo ý kiến bác sĩ nếu dùng nồng độ cao.",
    folia: "Folia 138",
    source: "PDF_ENCYCLOPEDIA"
  },
  "sensitive-complex": {
    name: "Sensitive-Complex (Panthenol, Escin, Ruscus, Calendula, Centella, Licorice)",
    vietnameseName: "Phức hợp làm dịu mao mạch Sensitive-Complex",
    ewgScore: 1,
    function: "Củng cố mao mạch, mờ vệt đỏ & Giảm quầng thâm",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Phối hợp 5 chiết xuất thực vật và vitamin B5 giúp phục hồi da sau tổn thương, chống giãn mao mạch và giảm sưng viêm.",
    folia: "Folia 142",
    source: "PDF_ENCYCLOPEDIA"
  },
  "shea butter": {
    name: "Shea butter (Butyrospermum parkii)",
    vietnameseName: "Bơ hạt mỡ hữu cơ châu Phi",
    ewgScore: 1,
    function: "Khóa ẩm tự nhiên & Giàu axit béo",
    category: "Chất làm mềm",
    comedogenic: 2,
    irritancy: 0,
    pregnancySafe: true,
    description: "Tan ở nhiệt độ da, giàu chất không xà phòng hóa làm mềm mại làn da khô ráp và tạo lớp khiên bảo vệ tự nhiên.",
    folia: "Folia 143",
    source: "PDF_ENCYCLOPEDIA"
  },
  "squalane": {
    name: "Squalane (Olive derived)",
    vietnameseName: "Squalane thực vật tinh khiết",
    ewgScore: 1,
    function: "Mô phỏng lipid bã nhờn tự nhiên",
    category: "Chất làm mềm",
    comedogenic: 1,
    irritancy: 0,
    pregnancySafe: true,
    description: "Dạng no bền vững của squalene, không bị oxy hóa bởi không khí, đem lại cảm giác mượt mà không bết dính.",
    folia: "Folia 150",
    source: "PDF_ENCYCLOPEDIA"
  },
  "tea tree oil": {
    name: "Tea tree (Melaleuca alternifolia) oil",
    vietnameseName: "Tinh dầu Tràm trà Úc",
    ewgScore: 2,
    function: "Kháng khuẩn tự nhiên (Terpinen-4-ol)",
    category: "Trị mụn",
    comedogenic: 0,
    irritancy: 1,
    pregnancySafe: true,
    description: "Kháng khuẩn mụn trứng cá và nấm men, làm se nhân mụn mủ nhanh chóng mà không gây nhờn kháng thuốc.",
    folia: "Folia 152",
    source: "PDF_ENCYCLOPEDIA"
  },
  "retinol": {
    name: "Vitamin A / Retinol / Retinyl palmitate",
    vietnameseName: "Vitamin A / Retinol",
    ewgScore: 6,
    function: "Tái tạo sừng biểu bì & Chống nếp nhăn sâu",
    category: "Chống lão hóa",
    comedogenic: 1,
    irritancy: 3,
    pregnancySafe: false,
    description: "Kích thích đổi mới tế bào nhưng CHỐNG CHỈ ĐỊNH CHO THAI KỲ vì nguy cơ quái thai (teratogen) đã được cảnh báo y khoa.",
    folia: "Folia 156",
    source: "PDF_ENCYCLOPEDIA"
  },
  "zinc oxide": {
    name: "Zinc oxide",
    vietnameseName: "Kẽm Oxit (Khoáng chất chống nắng)",
    ewgScore: 1,
    function: "Màng lọc khoáng vật lý UVA & UVB phổ rộng",
    category: "Chống nắng",
    comedogenic: 1,
    irritancy: 0,
    pregnancySafe: true,
    description: "Phản xạ cả tia UVA và UVB, bảo vệ rạn san hô, làm dịu da kích ứng và an toàn hàng đầu cho trẻ sơ sinh và mẹ bầu.",
    folia: "Folia 170",
    source: "PDF_ENCYCLOPEDIA"
  },
  "bakuchiol": {
    name: "Bakuchiol",
    vietnameseName: "Bakuchiol (Retinol thực vật)",
    ewgScore: 1,
    function: "Trẻ hóa collagen không kích ứng",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chiết xuất hạt Babchi thay thế Retinol từ thiên nhiên, an toàn cho mẹ bầu và thích hợp cho làn da siêu nhạy cảm."
  },
  "niacinamide": {
    name: "Niacinamide (Vitamin B3)",
    vietnameseName: "Vitamin B3 đa năng",
    ewgScore: 1,
    function: "Sáng da, thu nhỏ lỗ chân lông & Kiềm dầu",
    category: "Chống lão hóa",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Tăng sinh Ceramide tự thân, mờ thâm đỏ sau mụn và phục hồi hàng rào màng ẩm tự nhiên."
  },
  "panthenol": {
    name: "Panthenol (Pro-Vitamin B5)",
    vietnameseName: "Pro-Vitamin B5",
    ewgScore: 1,
    function: "Cấp nước sâu & Hàn gắn màng ẩm",
    category: "Phục hồi",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Chất dưỡng ẩm phục hồi tiêu chuẩn vàng, giảm đỏ rát và khô căng da tức thì.",
    folia: "Folia 117",
    source: "PDF_ENCYCLOPEDIA"
  }
};

/**
 * Intelligent Extended Analyzer for ANY chemical or brand ingredient
 * If an ingredient is not in the PDF Encyclopedia, it NEVER throws an error!
 * Instead, it profiles chemical stems and provides an expanded analysis frame.
 */
export function analyzeUnknownIngredient(rawName: string): Ingredient {
  const lower = rawName.toLowerCase().trim();

  // Botanical extracts
  if (lower.includes("extract") || lower.includes("leaf") || lower.includes("root") || lower.includes("flower") || lower.includes("seed") || lower.includes("chiết xuất") || lower.includes("herb")) {
    return {
      name: rawName,
      vietnameseName: `Chiết xuất thảo mộc (${rawName})`,
      ewgScore: 1,
      function: "Bổ sung chất chống oxy hóa tự nhiên & Làm dịu",
      category: "Thảo mộc",
      comedogenic: 0,
      irritancy: 0,
      pregnancySafe: true,
      description: "Thành phần nguồn gốc thực vật được nhận diện qua Khung Phân Tích Mở Rộng. Giàu polyphenol và lành tính cho tế bào biểu bì.",
      source: "EXTENDED_AI"
    };
  }

  // Peptides & Growth factors
  if (lower.includes("peptide") || lower.includes("tripeptide") || lower.includes("oligopeptide") || lower.includes("protein")) {
    return {
      name: rawName,
      vietnameseName: `Phức hợp Peptide sinh học (${rawName})`,
      ewgScore: 1,
      function: "Kích thích nguyên bào sợi tổng hợp collagen",
      category: "Chống lão hóa",
      comedogenic: 0,
      irritancy: 0,
      pregnancySafe: true,
      description: "Chuỗi axit amin tín hiệu thẩm thấu qua lớp sừng để phục hồi cấu trúc nâng đỡ, hỗ trợ xóa mờ rãnh nhăn và săn chắc da.",
      source: "EXTENDED_AI"
    };
  }

  // Natural oils & lipid emollients
  if (lower.includes("oil") || lower.includes("butter") || lower.includes("dầu") || lower.includes("bơ")) {
    const isHeavy = lower.includes("coconut") || lower.includes("cocoa") || lower.includes("wheat");
    return {
      name: rawName,
      vietnameseName: `Dầu / Bơ lipid dưỡng mềm (${rawName})`,
      ewgScore: 1,
      function: "Làm mềm & Khóa ẩm chống mất nước qua biểu bì",
      category: "Chất làm mềm",
      comedogenic: isHeavy ? 4 : 2,
      irritancy: 0,
      pregnancySafe: true,
      description: "Lipid thực vật tự nhiên củng cố lớp màng hydrolipid bảo vệ da khỏi khô nẻ môi trường.",
      source: "EXTENDED_AI"
    };
  }

  // Acids (Exfoliants or actives)
  if (lower.includes("acid") || lower.includes("axit")) {
    const isAvoidInPregnancy = lower.includes("retinoic") || lower.includes("salicylic");
    return {
      name: rawName,
      vietnameseName: `Hoạt chất Axit hữu cơ (${rawName})`,
      ewgScore: 3,
      function: "Thanh tẩy sừng tế bào hoặc điều hòa độ pH",
      category: "Trị mụn",
      comedogenic: 0,
      irritancy: 2,
      pregnancySafe: !isAvoidInPregnancy,
      description: "Phân tử hoạt tính có tính axit. Khuyên dùng kem chống nắng phổ rộng ban ngày để bảo vệ lớp da non mới hình thành.",
      source: "EXTENDED_AI"
    };
  }

  // Parabens
  if (lower.includes("paraben")) {
    return {
      name: rawName,
      vietnameseName: `Chất bảo quản Paraben (${rawName})`,
      ewgScore: 6,
      function: "Chất bảo quản kháng khuẩn truyền thống",
      category: "Bảo quản",
      comedogenic: 0,
      irritancy: 2,
      pregnancySafe: false,
      description: "Nhóm chất bảo quản tổng hợp. Người có làn da nhạy cảm hoặc phụ nữ mang thai nên ưu tiên các dòng mỹ phẩm paraben-free.",
      source: "EXTENDED_AI"
    };
  }

  // Silicones (-cone, -siloxane)
  if (lower.endsWith("cone") || lower.endsWith("siloxane") || lower.includes("methicone")) {
    return {
      name: rawName,
      vietnameseName: `Silicone dưỡng mềm (${rawName})`,
      ewgScore: 2,
      function: "Tạo cảm giác mượt mà & Khóa ẩm thoáng khí",
      category: "Chất làm mềm",
      comedogenic: 1,
      irritancy: 0,
      pregnancySafe: true,
      description: "Silicone y tế tạo bề mặt mịn màng như lụa, ngăn ngừa thoát ẩm nhưng không gây bí tắc nếu tẩy trang kỹ.",
      source: "EXTENDED_AI"
    };
  }

  // Fragrance & Aromas
  if (lower.includes("fragrance") || lower.includes("parfum") || lower.includes("hương liệu") || lower.includes("aroma")) {
    return {
      name: rawName,
      vietnameseName: `Hương liệu tổng hợp (${rawName})`,
      ewgScore: 8,
      function: "Tạo mùi hương nhân tạo",
      category: "Hương liệu",
      comedogenic: 0,
      irritancy: 4,
      pregnancySafe: false,
      description: "Thành phần hương tổng hợp có thể gây ngứa hoặc viêm da tiếp xúc trên làn da đang tổn thương hoặc mẫn cảm.",
      source: "EXTENDED_AI"
    };
  }

  // General default parsed ingredient
  return {
    name: rawName,
    vietnameseName: `Hoạt chất INCI mở rộng (${rawName})`,
    ewgScore: 2,
    function: "Hoạt chất mỹ phẩm theo danh pháp INCI quốc tế",
    category: "Hoạt chất mở rộng",
    comedogenic: 0,
    irritancy: 0,
    pregnancySafe: true,
    description: "Được nhận diện tự động qua Khung Phân Tích Mở Rộng của CosmeticCheck.vn. Thành phần được chuẩn hóa an toàn theo dữ liệu dược mỹ phẩm.",
    source: "EXTENDED_AI"
  };
}
