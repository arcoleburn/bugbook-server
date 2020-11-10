'use strict';


const ObservationsService = {
  getObservationsForUser(db, userId) {
    return db
      .from('observations')
      .select('*')
      .where('user_id', userId);
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

module.exports = ObservationsService ;
