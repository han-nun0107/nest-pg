import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('task-comments')
export class TaskCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;
}
