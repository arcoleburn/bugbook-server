'use strict';

const EntriesService = {
  getEntriesForUser(db, userId) {
    console.log('get entries for user ran');
    return db
      .from('journal_data AS ent')
      .select('*')
      .where('user_id', userId);
  },

  serializeEntry(entry) {
    return {
      id: entry.id,
      date_created: (entry.date_created.toString()),
      day_rating: parseInt(entry.day_rating),
      deep_hours: parseFloat(entry.deep_hours),
      journal_entry: entry.journal_entry,
      user_id: parseInt(entry.user_id),
    };
  },
};

module.exports = EntriesService;
