import { Skill } from 'models/main';

export const createSkills = (skillsData) => {
  return Skill.bulkCreate(skillsData);
}

export const deleteSkillsByProfileId = (profileId) => {
  return Skill.destroy({ where: { profileId } })
}

