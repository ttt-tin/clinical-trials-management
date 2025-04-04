import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { PortfolioCategory } from '../portfolio/entities/portfolio.entity';

export const mockPortfolios: Partial<Portfolio>[] = [
  {
    title: 'Nghiên cứu Phase 1: Điều trị ung thư phổi',
    description: 'Nghiên cứu đánh giá hiệu quả và độ an toàn của phương pháp điều trị mới cho bệnh nhân ung thư phổi giai đoạn cuối.',
    category: PortfolioCategory.PHASE_1,
    isActive: true,
    progress: 30,
    tags: ['ung thư phổi', 'phase 1', 'điều trị mới']
  },
  {
    title: 'Nghiên cứu Phase 2: Vắc-xin COVID-19',
    description: 'Đánh giá hiệu quả của vắc-xin COVID-19 thế hệ mới trên nhóm đối tượng người cao tuổi.',
    category: PortfolioCategory.PHASE_2,
    isActive: true,
    progress: 60,
    tags: ['covid-19', 'phase 2', 'vắc-xin']
  },
  {
    title: 'Nghiên cứu Phase 3: Thuốc điều trị tiểu đường',
    description: 'Thử nghiệm lâm sàng quy mô lớn đánh giá hiệu quả của thuốc điều trị tiểu đường type 2.',
    category: PortfolioCategory.PHASE_3,
    isActive: true,
    progress: 10,
    tags: ['tiểu đường', 'phase 3', 'điều trị']
  }
]; 