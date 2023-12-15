const Fehlerklasse = require("../models/Fehlerklasse");
const Fehlerdetail = require("../models/Fehlerdetail");
const Fehler = require("../models/Fehler");
const Sitzung = require("../models/Sitzung");
const Student = require("../models/Student")
const {query, QueryTypes} = require("../config/sequelizeConfig");

/**
 * Returns all possible mistakes to be made as markdown table.
 * @returns {Promise<string>} markdown table with mistakes
 */
async function loadMistakesAsMarkdown() {

  Fehlerklasse.hasMany(Fehlerdetail, { foreignKey: 'fehlerklasse_id' });
  Fehlerdetail.belongsTo(Fehlerklasse, { foreignKey: 'fehlerklasse_id' });

  const fehlerdetails = await Fehlerdetail.findAll({
    include: Fehlerklasse
  });

  let markdownFehlerdetails = '| fehlerdetail_id | fehlerklasse | name | detail |\n| --- | --- | --- | --- |\n';
  fehlerdetails.forEach(fehlerdetail => {
    markdownFehlerdetails += `| ${fehlerdetail.fehlerdetail_id} | ${fehlerdetail.Fehlerklasse.name} | ${fehlerdetail.name} | ${fehlerdetail.detail} |\n`;
  });

  return markdownFehlerdetails;
}

/**
 * Returns Fehlerhistorie of a student as markdown table
 * @param sitzungId current session id
 * @returns {Promise<string>} markdown table with Fehlerhistorie
 */
async function loadFehlerhistorieAsMarkdown(sitzungId) {
  Sitzung.belongsTo(Student, { foreignKey: 'student_id' });
  Fehler.belongsTo(Sitzung, { foreignKey: 'sitzung_id' });
  Fehler.belongsTo(Fehlerdetail, { foreignKey: 'fehlerdetail_id' });
  Sitzung.hasMany(Fehler, { foreignKey: 'sitzung_id' });
  Fehlerdetail.hasMany(Fehler, { foreignKey: 'fehlerdetail_id' });

  const sitzung = await Sitzung.findByPk(sitzungId);
  if (!sitzung) {
    throw new Error('Sitzung nicht gefunden');
  }

  const sitzungen = await Sitzung.findAll({
    where: { student_id: sitzung.student_id },
    include: [
      {
        model: Fehler,
        include: [
          {
            model: Fehlerdetail,
          }
        ]
      }
    ]
  });

  let markdownTable = '| sitzung_id | tag und uhrzeit | fehlerdetail_id | anzahl |\n| --- | --- | --- | --- |\n';

  let errorCounts = {};

  sitzungen.forEach(sitzung => {
    sitzung.Fehlers.forEach(fehler => {
      let key = `${sitzung.sitzung_id}-${fehler.fehlerdetail_id}`;
      if (!errorCounts[key]) {
        errorCounts[key] = {
          sitzung_id: sitzung.sitzung_id,
          zeitpunkt: sitzung.session_start,
          fehlerdetail_id: fehler.fehlerdetail_id,
          anzahl: 0
        };
      }
      errorCounts[key].anzahl += 1;
    });
  });

  Object.values(errorCounts).forEach(errorCount => {
    let date = new Date(errorCount.zeitpunkt);
    let formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0,5)}`;
    markdownTable += `| ${errorCount.sitzung_id} | ${formattedDate} | ${errorCount.fehlerdetail_id} | ${errorCount.anzahl} |\n`;
  });

  return markdownTable;
}

/**
 * Reads gptResponse and searches for all mistakes made. Adds them to the database.
 * @param gptResponse response of evaluation endpoint
 * @param session session
 */
async function addFehler(gptResponse, session) {
  if (!session) return;

  try {
    const fehlerArray = [];
    const jsonGptResponse = JSON.parse(gptResponse);
    jsonGptResponse.forEach(fehler => {
      fehlerArray.push({fehlerdetail_id: fehler.fehlerdetail_id, sitzung_id: session});
    });

    await Fehler.bulkCreate(fehlerArray);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  loadMistakesAsMarkdown,
  addFehler,
  loadFehlerhistorieAsMarkdown
};