import './SkillTreeHeader.css'

interface Props {
  skillPoints: number
  respecPoints: number
}

export function SkillTreeHeader({ skillPoints, respecPoints }: Props) {
  return (
    <div className="skill-tree-header">
      <span className="skill-tree-header__item">
        <span className="skill-tree-header__value">{skillPoints}</span>
        <span className="skill-tree-header__label">Skill Points</span>
      </span>
      <span className="skill-tree-header__sep">·</span>
      <span className="skill-tree-header__item">
        <span className="skill-tree-header__value">{respecPoints}</span>
        <span className="skill-tree-header__label">Respec Points</span>
      </span>
    </div>
  )
}