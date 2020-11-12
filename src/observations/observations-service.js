'use strict';

const ObservationsService = {
  getObservationsForUser(db, userId) {
    return db
      .from('observations')
      .select('*')
      .where('user_id', userId);
  },
  insertObservation(db, newObs, userId) {
    console.log('insert obs from services ran');
    return db
      .insert(newObs)
      .into('observations')
      .returning('*')
      .where('user_Id', userId)
      .then((rows) => {
        return rows[0];
      });
  },
  serializeObservation(obs) {
    return {
      id: obs.id,
      user_id: parseInt(obs.user_id),
      date_created: obs.date_created.toString(),
      observation: obs.observation,
    };
  },
};

module.exports = ObservationsService;
