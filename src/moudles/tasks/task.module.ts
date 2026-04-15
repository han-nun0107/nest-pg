import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';

import { TaskEntity } from './entities/task.entity';
import { TaskCommentEntity } from './entities/task-comment.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, TaskCommentEntity])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
