export const calculateThresholds = (position) => {
  const { requirements } = position;
  return requirements.map(({ technology, level, priority }) => {
    const { id: technologyId } = technology;
    const { value: levelValue } = level;
    const { deviation } = priority;
    let threshold = levelValue - deviation;
    if (threshold < 0) {
      threshold = 0;
    }
    return { technologyId, threshold };
  });
};

export const isCandidateIdeal = (requirementsThresholds, profile) => {
  return requirementsThresholds.every(({ threshold, technologyId }) => {
    const { skills } = profile;
    const requiredSkill = skills.find(
      ({ technology: { id } }) => id === technologyId
    );
    return requiredSkill ? requiredSkill.level.value >= threshold : false;
  });
};

export const calculateMaxInterval = (reqThresholds) => {
  const sum = reqThresholds.reduce(
    (res, { threshold }) => res + threshold * threshold,
    0
  );
  return Math.sqrt(sum);
};

export const calculateInterval = (reqThresholds, profile) => {
  if (isCandidateIdeal(reqThresholds, profile)) {
    return 0;
  }
  const { skills } = profile;
  const sum = reqThresholds.reduce((res, { technologyId, threshold }) => {
    const requiredSkill = skills.find(
      ({ technology: { id } }) => id === technologyId
    );
    const level = requiredSkill ? requiredSkill.level.value : 0;
    return res + (threshold - level) * (threshold - level);
  }, 0);
  return Math.sqrt(sum);
};

export const compareByKoef = (a, b) => {
  if (a.koef > b.koef) {
    return -1;
  }
  if (a.koef < b.koef) {
    return 1;
  }
  return 0;
};

export const sortCandidatesByKoef = (candidates) => candidates.sort(compareByKoef);