import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryColumn()
  sku: string;

  @Column({
    type: 'int',
  })
  buyHalfScrap: number;

  @Column({
    type: 'int',
  })
  buyKeys: number;

  @Column({
    type: 'int',
  })
  sellHalfScrap: number;

  @Column({
    type: 'int',
  })
  sellKeys: number;

  @PrimaryColumn()
  createdAt: Date;
}
