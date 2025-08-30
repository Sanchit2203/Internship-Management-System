
function calculateScore(tenthMarks, twelfthMarks, cgpa) {
  // The formula is: (10% / 10 + 12% / 10 + cgpa) / 3
  const score = (tenthMarks / 10 + twelfthMarks / 10 + cgpa) / 3;
  return score;
}
