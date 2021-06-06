<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SlicingTable extends Migration
{
	public function up()
	{
		$this->forge->addField([
			'id' => [
				'type'           => 'INT',
				'constraint'     => 5,
				'unsigned'       => true,
				'auto_increment' => true,
			],
			'code' => [
				'type'       => 'VARCHAR',
				'constraint' => '50',
			],
			'image' => [
				'type'       => 'VARCHAR',
				'constraint' => '100',
			],
			'slicing_mode' => [
				'type' => 'VARCHAR',
				'constraint' => '20',
			],
			'position' => [
			    'type'           => 'INT',
			    'constraint'     => 3,
			    'unsigned'       => true,
			],
			'ocr_result' => [
				'type' => 'TEXT',
				'default' => '',
				'null' => true
			]
		]);

		$this->forge->addKey('id', true);
		$this->forge->createTable('slicing');
	}

	public function down()
	{
		$this->forge->dropTable('slicing');
	}
}
