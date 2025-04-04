import { Portfolio } from '../app/portfolios/shared/portfolio.model';

export const mockPortfolios: Portfolio[] = [
  {
    id: 1,
    title: 'Nghiên cứu điều trị ung thư phổi giai đoạn sớm',
    description: 'Đánh giá hiệu quả của liệu pháp miễn dịch kết hợp với hóa trị trong điều trị ung thư phổi không tế bào nhỏ giai đoạn I-II',
    category: 'Phase 2',
    isActive: true,
    progress: 75,
    tags: ['Ung thư phổi', 'Liệu pháp miễn dịch', 'Hóa trị'],
    startDate: new Date('2024-01-15'),
    endDate: new Date('2025-06-30'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: 2,
    title: 'Thử nghiệm vắc-xin COVID-19 biến thể mới',
    description: 'Đánh giá tính an toàn và hiệu quả của vắc-xin COVID-19 thế hệ mới đối với các biến thể mới nổi',
    category: 'Phase 3',
    isActive: true,
    progress: 45,
    tags: ['COVID-19', 'Vắc-xin', 'Biến thể'],
    startDate: new Date('2024-02-01'),
    endDate: new Date('2025-01-31'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 3,
    title: 'Nghiên cứu thuốc điều trị tiểu đường type 2',
    description: 'Thử nghiệm lâm sàng về thuốc mới điều trị tiểu đường type 2 với cơ chế tác động kép',
    category: 'Phase 1',
    isActive: false,
    progress: 20,
    tags: ['Tiểu đường', 'Nội tiết', 'Thuốc mới'],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-12-31'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-01')
  }
]; 