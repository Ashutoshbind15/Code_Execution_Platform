export function normalizeOutput(output) {
  // Split the output into lines, trim each line, and remove empty lines
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function compareOutputs(judge0Output, expectedOutput) {
  // Normalize outputs
  const normalizedJudge0Output = normalizeOutput(judge0Output);
  const normalizedExpectedOutput = normalizeOutput(expectedOutput);

  // Initialize the result object
  const result = {
    isMatch: true,
    differences: [],
  };

  // Compare the length of the outputs first
  if (normalizedJudge0Output.length !== normalizedExpectedOutput.length) {
    result.isMatch = false;
    result.differences.push(
      `Output lengths differ. Expected ${normalizedExpectedOutput.length} lines, got ${normalizedJudge0Output.length} lines.`
    );
  }

  // Compare each line
  const minLength = Math.min(
    normalizedJudge0Output.length,
    normalizedExpectedOutput.length
  );
  for (let i = 0; i < minLength; i++) {
    if (normalizedJudge0Output[i] !== normalizedExpectedOutput[i]) {
      result.isMatch = false;
      result.differences.push(
        `Line ${i + 1}: Expected "${normalizedExpectedOutput[i]}", got "${
          normalizedJudge0Output[i]
        }"`
      );
    }
  }

  return result;
}
