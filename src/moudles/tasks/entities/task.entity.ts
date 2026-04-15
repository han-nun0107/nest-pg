import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/* 실제 테이블 이름과 매핑이 됌 */
@Entity('tasks')
export class TaskEntity {
  /* string으로 받을 시 uuid으로 변환을 시켜줘야 함 */
  /* number로 받을 시 빈 값으로 하면 자동으로 숫자가 증가 */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  category: string;

  @Column()
  thumbnail: string;
}
