// Link nội bộ: mở file .md ngay trong trang (DocViewer)
export const GT = '#doc/giaotrinh/'
export const LESSONS = [
  ['N1', 'NhapMon_01_ThanhDieu', 'Thanh điệu'], ['N2', 'NhapMon_02_PhuAm_NguyenAm', 'Phụ âm & vần'], ['N3', 'NhapMon_03_ChuHan', 'Chữ Hán & bộ thủ'],
  ['1', 'HSK1_01_ChaoHoi', 'Chào hỏi'], ['2', 'HSK1_02_TenQuocTich', 'Tên & quốc tịch'], ['3', 'HSK1_03_SoDem', 'Số đếm, tuổi'],
  ['4', 'HSK1_04_GiaDinh', 'Gia đình'], ['5', 'HSK1_05_ThoiGian', 'Ngày tháng, giờ'], ['6', 'HSK1_06_AnUong', 'Ăn uống, gọi món'],
  ['7', 'HSK1_07_MuaSam', 'Mua sắm, trả giá'], ['8', 'HSK1_08_DiaDiem', 'Hỏi đường'], ['9', 'HSK1_09_CongViec', 'Công việc'],
  ['10', 'HSK1_10_DiLai_ThoiTiet', 'Đi lại & thời tiết'],
].map(([id, file, title]) => ({ id, file, title, label: id.startsWith('N') ? `Nhập môn ${id.slice(1)}` : `HSK1 · Bài ${id}` }))
export { VOCAB } from './vocab.js'
