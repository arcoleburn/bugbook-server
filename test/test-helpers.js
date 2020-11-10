'use strict';
function makeUsers() {
  return [
    {
      id: 1,
      username: 'fred1',
      password: 'password',
      email: 'fred@fred.com',
      first_name: 'fred',
    },
    {
      id: 2,
      username: 'frank1',
      password: 'password',
      email: 'frank@fred.com',
      first_name: 'frank',
    },
    {
      id: 3,
      username: 'mary1',
      password: 'password',
      email: 'mary@fred.com',
      first_name: 'mary',
    },
  ];
}

function makeEntries() {
  return [
    {
      id: 1,
      date_created: new Date(),
      day_rating: 1,
      deep_hours: 3,
      journal_entry: 'this is my entry for today',
      user_id: 1,
    },
    {
      id: 2,
      date_created: new Date(2020, 10, 8),
      day_rating: 2,
      deep_hours: 2,
      journal_entry: 'this is another entry ',
      user_id: 1,
    },
    {
      id: 3,
      date_created: new Date(2020, 10, 7),
      day_rating: -2,
      deep_hours: 1,
      journal_entry: 'tthis is  ne w line for the test blah blah ',
      user_id: 1,
    },
    {
      id: 4,
      date_created: new Date(2020, 10, 6),
      day_rating: 0,
      deep_hours: 3,
      journal_entry: 'thisis another thing to put in ',
      user_id: 1,
    },
    {
      id: 5,
      date_created: new Date(2020, 10, 5),
      day_rating: 1,
      deep_hours: 2.5,
      journal_entry: 'this for today',
      user_id: 1,
    },
    {
      id: 6,
      date_created: new Date(2020, 10, 4),
      day_rating: 1,
      deep_hours: 1,
      journal_entry: 'BLEHHHHHy',
      user_id: 1,
    },
  ];
}

function makeObservations() {
  return [
    {
      id: 1,
      user_id: 1,
      date_created: new Date(),
      observation: 'likes to go for walks',
    },
    {
      id: 2,
      user_id: 1,
      date_created: new Date(),
      observation: 'likes to sleep in',
    },
    {
      id: 3,
      user_id: 1,
      date_created: new Date(),
      observation: 'gets frustrated when not in control',
    },
    {
      id: 4,
      user_id: 1,
      date_created: new Date(),
      observation: 'finds heavy metal relaxing',
    },
    {
      id: 5,
      user_id: 1,
      date_created: new Date(),
      observation: 'is not your man, its nevada.',
    },
  ];
}

function seedTables(db, users, entries, observations) {
  return db.transaction(async (trx) => {
    await trx.into('users').insert(users);
    await trx.into('journal_data').insert(entries);
    await trx.into('observations').insert(observations);
  });
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx.raw('TRUNCATE users, journal_data, observations')
  );
}

module.exports = {
  makeUsers,
  makeEntries,
  makeObservations,
  seedTables,
  cleanTables,
};
