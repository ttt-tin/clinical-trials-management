import { Investigator } from '../investigator/entities/investigator.entity';
import { InvestigatorRole } from '../investigator/entities/investigator.entity';

export const mockInvestigators: Partial<Investigator>[] = [
  {
    firstName: 'Lê Minh',
    lastName: 'Cường',
    email: 'cuong.le@hospital.com',
    phone: '0901234567',
    role: InvestigatorRole.PRINCIPAL,
    specialization: 'Ung thư học',
    institution: 'Bệnh viện K',
    isActive: true
  },
  {
    firstName: 'Phạm Thị',
    lastName: 'Dung',
    email: 'dung.pham@hospital.com',
    phone: '0912345678',
    role: InvestigatorRole.SUB,
    specialization: 'Nội khoa',
    institution: 'Bệnh viện Bạch Mai',
    isActive: true
  },
  {
    firstName: 'Hoàng Văn',
    lastName: 'Em',
    email: 'em.hoang@hospital.com',
    phone: '0923456789',
    role: InvestigatorRole.COORDINATOR,
    specialization: 'Huyết học',
    institution: 'Bệnh viện Chợ Rẫy',
    isActive: true
  }
]; 