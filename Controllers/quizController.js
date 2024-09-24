const Quiz = require('../models/Quiz');

exports.getQuestions = async (req, res) => {
  const questions = await Quiz.aggregate([{ $sample: { size: 6 } }]);
  res.json(questions);
};
