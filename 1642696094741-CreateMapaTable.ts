import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateMapaTable1642696094741 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name:'tb_mapa',
            columns:[
                {
                    name: 'id',
                    type: 'serial',
                    isPrimary: true
                },
                {
                    name: 'name',
                    type: 'varchar(100)',
                    isNullable: false
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tb_mapa')
    }

}
