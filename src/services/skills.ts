import { Skill } from 'models/main';

export const createSkills = (skillsData) => {
  return Skill.bulkCreate(skillsData);
}

