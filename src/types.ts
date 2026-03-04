export interface MissingSkill {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SkillCoverage {
  category: string;
  studentScore: number; // 0-100
  requiredScore: number; // Usually 100 or based on JD emphasis
}

export interface AnalysisResult {
  matchScore: number; // 0-100
  readinessLevel: string; // e.g., "High", "Medium", "Low"
  missingSkills: MissingSkill[];
  skillCoverage: SkillCoverage[];
  roadmap: string[];
  summary: string;
}
