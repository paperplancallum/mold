export const LAB_TECHNICIANS = [
  'Dr. Sarah Chen',
  'Dr. Michael Rodriguez',
  'Dr. Jennifer Park',
  'Dr. David Kim',
  'Emily Thompson, MS',
  'James Wilson, PhD',
  'Dr. Lisa Martinez',
  'Robert Anderson, MS',
  'Dr. Amanda Lewis',
  'Christopher Lee, PhD',
  'Dr. Maria Garcia',
  'Daniel Brown, MS',
  'Dr. Rachel Cohen',
  'Kevin Patel, PhD',
  'Dr. Nicole Johnson'
] as const

export type LabTechnicianName = typeof LAB_TECHNICIANS[number]

export function getRandomTechnician(): LabTechnicianName {
  const randomIndex = Math.floor(Math.random() * LAB_TECHNICIANS.length)
  return LAB_TECHNICIANS[randomIndex]
}

export function getTechnicianInitials(name: string): string {
  return name
    .split(' ')
    .filter(word => !word.includes(',') && !['MS', 'PhD', 'Dr.'].includes(word))
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

export function getTechnicianCredential(name: string): string | null {
  if (name.includes('Dr.')) return 'Doctor'
  if (name.includes('PhD')) return 'PhD'
  if (name.includes('MS')) return 'Master of Science'
  return null
}