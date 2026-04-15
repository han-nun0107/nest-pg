import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'service_agreed' })
  serviceAgreed: boolean;

  @Column({ name: 'privacy_agreed' })
  privacyAgreed: boolean;

  @Column({ name: 'marketing_agreed' })
  marketingAgreed: boolean;
}
