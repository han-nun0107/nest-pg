import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskEntity } from './entities/task.entity';

import { CreateTaskDto, UpdateTaskDto } from './dto';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  /* 조회 - 전체
  DB의 모든 데이터를 배열 형태로 가져옴
  sql : SELECT * FROM tasks */
  async findAll(): Promise<TaskEntity[]> {
    /* find는 조건 없이 호출하면 전체 데이터를 조회 */
    return await this.taskRepository.find();
  }

  /* 조회 - 단건
  특정 id를 가진 데이터를 찾고 없으면 404 에러 반환
  sql: SELECT * FROM tasks WHERE id = ? */
  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
      },
    });
    if (!task) {
      throw new NotFoundException(
        `ID의 값이 ${id}인 테스크를 찾을 수가 없습니다.`,
      );
    }
    return task;
  }

  /* 생성 
  DTO를 엔티티 객체로 매핑한 후 실제 DB에 저장하는 로직
  sql: INSERT INTO tasks (title, content, category, thumbnail, ...) */
  async create(payload: CreateTaskDto) {
    /* Entity 기반으로 설계된 테이블 구조에 맞게 매핑한 후 저장 
    create(): DTO 데이터를 바탕으로 새로운 엔티티 인스턴스 생성 -> DB 저장 전 단계 */
    const newTask = this.taskRepository.create(payload);

    /* save(): 생상된 엔티티 객체를 실제 DB 테이블에 저장 */
    await this.taskRepository.save(newTask);

    return {
      message: '테스크 생성을 완료하였습니다.',
      statusCode: HttpStatus.CREATED /* 201 반환 */,
    };
  }

  /* 수정
  특정 ID의 데이터를 찾아서 payload(UpdateTaskDto)의 내용으로 변경
  sql: UPDATE tasks SET title =?, content =?, category =?, thumbnail =? WHERE id = ? */
  async update(id: number, payload: UpdateTaskDto): Promise<TaskEntity> {
    /* 기존 데이터가 있는지 확인
    findOne()을 호출하여 데이터 확인
    데이터가 없으면 getTask 내부에서 NotFoundExeption을 발생 */

    const task = await this.findOne(id);

    /* 데이터 병합 
    Object.assign(대상객체, 소스객체)를 사용하여 기준 엔티티에 수정된 내용만 덮어씌우기
    payload에 없는 속성은 기본 값을 유지 */
    Object.assign(task, payload);

    /* DB 저장 save() 메서드는 엔티티에 primary key(id)가 포함되어 있으면 
    새로운 행을 생성하지 않고, 기존 행을 업데이트 */
    return await this.taskRepository.save(task);
  }

  /* 삭제 
   ID를 기준으로 데이터를 삭제
   sql: DELETE FROM tasks WHERE id = ? */
  async remove(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(
        `ID의 값이 ${id}인 테스크를 찾을 수가 없습니다.`,
      );
    }
    /* delete(): 해당 ID의 데이터를 삭제 */
    await this.taskRepository.delete(id);

    return {
      message: '테스크 삭제를 완료하였습니다.',
      statusCode: HttpStatus.NO_CONTENT /* 204 반환 */,
    };
  }
}
