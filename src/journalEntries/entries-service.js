'use strict';

const EntriesService = {
  getEntriesForUser(db, userId) {
    return db
      .from('journal_data')
      .select('*')
      .where('user_id', userId);
  },

  insertEntry(db, newEntry, userId) {
    return db
      .insert(newEntry)
      .into('journal_data')
      .returning('*')
      // .where('user_Id', userId)
      .then((rows) => {
        return rows[0];
      });
  },

  serializeEntry(entry) {
    return {
      id: entry.id,
      date_created: new Date(entry.date_created),
      day_rating: parseInt(entry.day_rating),
      deep_hours: parseFloat(entry.deep_hours),
      journal_entry: entry.journal_entry,
      user_id: entry.user_id,
    };
  },
  deleteEntry(db, id){
    return db('journal_data').where({id}).delete();
  },
  updateEntry(db, id, updatedEntry){
    return db('journal_data').where({id}).update(updatedEntry).returning('*').then((rows) => {
     
      return rows[0];
    });
  }
};

module.exports = EntriesService;
