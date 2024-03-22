// THIS IS GOING TO BE USED IN THE NEW BRANCH FOR THE CRF ATTACK MITIGATION SETUP
// THIS IS GOING TO BE USED IN THE NEW BRANCH FOR THE CRF ATTACK MITIGATION SETUP
// THIS IS GOING TO BE USED IN THE NEW BRANCH FOR THE CRF ATTACK MITIGATION SETUP
// THIS IS GOING TO BE USED IN THE NEW BRANCH FOR THE CRF ATTACK MITIGATION SETUP
// THIS IS GOING TO BE USED IN THE NEW BRANCH FOR THE CRF ATTACK MITIGATION SETUP
// THIS IS GOING TO BE USED IN THE NEW BRANCH FOR THE CRF ATTACK MITIGATION SETUP

import { Sql } from 'postgres';

export type Session = {
  id: number;
  token: string;
  userId: number;
  csrfSecret: string;
};

export async function up(sql: Sql) {
  await sql`
    ALTER TABLE sessions
    ADD csrf_secret varchar(100) NOT NULL;
  `;

  // ALTER TABLE sessions ALTER COLUMN csrf_secret DROP DEFAULT;
}

export async function down(sql: Sql) {
  await sql`
    ALTER TABLE sessions
    DROP COLUMN csrf_secret;
  `;

  // ALTER TABLE sessions ALTER COLUMN csrf_secret ADD DEFAULT '';
}
