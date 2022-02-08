import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateLocalTable1642696500600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'tb_local',
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
                },
                {
                    name: 'latitude',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'longitude',
                    type: 'varchar',
                    isNullable: false
                }
            ]   
             }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tb_local')
    }

}
