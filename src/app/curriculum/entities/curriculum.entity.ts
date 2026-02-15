import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { TagEntity } from '../../tags/entities/tag.entity';

@Entity('curriculums')
export class CurriculumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  lattesId: string;

  @Column({ type: 'bit' })
  active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  serviceYears: string;

  @Column({ type: 'varchar', length: 'max' })
  curriculum: string;

  @Column({ type: 'varchar', length: 255 })
  updatedDate: string;

  @ManyToMany(() => TagEntity, (tag) => tag.curriculums, { cascade: true })
  @JoinTable({
    name: 'curriculum_tags',
    joinColumn: { name: 'curriculum_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
