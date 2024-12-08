exports.up = function (knex) {
    return knex.schema.createTable('messages', (table) => {
      table.increments('id').primary();
      table.string('content').notNullable();
      table.string('room').notNullable();
      table.string('sender').notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('messages');
  };
  