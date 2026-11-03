// Chính sách giảm giá theo score của hạng thành viên (đơn vị: phần trăm)
// Bảng này khớp 3 hạng mẫu: BRONZE (0), SILVER (100), GOLD (500)
const TIERS = [
  { minScore: 500, percent: 10 },
  { minScore: 100, percent: 5 },
  { minScore: 0, percent: 0 },
];

function discountForScore(score) {
  const s = Number(score);
  if (isNaN(s) || s < 0) return 0;
  const tier = TIERS.find((t) => s >= t.minScore);
  return tier ? tier.percent : 0;
}

module.exports = { discountForScore };
