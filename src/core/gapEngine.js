/**
 * GAP Analysis Engine
 * Core logic for calculating competency gaps and recommendations
 */

// Calculate current BC coverage from selected courses
export function calculateCurrentBC(selectedCourses, coursesData) {
  const currentBC = {
    BC1: 0, BC2: 0, BC3: 0, BC4: 0, BC5: 0,
    BC6: 0, BC7: 0, BC8: 0, BC9: 0, BC10: 0, BC11: 0
  }

  selectedCourses.forEach(courseId => {
    const course = coursesData.find(c => c.id === courseId)
    if (course && course.bcContribution) {
      Object.entries(course.bcContribution).forEach(([bc, value]) => {
        if (currentBC[bc] !== undefined) {
          // Sum up contributions (no cap)
          currentBC[bc] += value
        }
      })
    }
  })

  return currentBC
}

// Calculate gap between target career and current state
export function calculateGap(career, currentBC) {
  const gap = {}
  
  if (!career || !career.bcWeights) return gap

  Object.keys(currentBC).forEach(bc => {
    const target = career.bcWeights[bc] || 0
    const current = currentBC[bc] || 0
    const diff = target - current
    gap[bc] = {
      target,
      current,
      diff,
      status: getGapStatus(diff, target, career.coreFocus?.includes(bc))
    }
  })

  return gap
}

// Determine gap status based on difference relative to target
function getGapStatus(diff, target, isCore) {
  if (diff <= 0) return 'satisfied'
  if (target === 0) return 'satisfied'
  
  const percentageMissing = diff / target
  
  if (isCore && percentageMissing > 0.5) return 'critical'
  if (percentageMissing > 0.7) return 'critical'
  if (percentageMissing > 0.4) return 'important'
  return 'minor'
}

// Generate recommendations based on gap analysis
export function generateRecommendations(gap, bcToCourses, coursesData, selectedCourses) {
  const recommendations = []
  const selectedSet = new Set(selectedCourses)

  // Sort BCs by gap severity and amount
  const bcPriority = Object.entries(gap)
    .filter(([_, data]) => data.diff > 0)
    .sort((a, b) => {
      // Prioritize critical gaps, then by diff amount
      const statusOrder = { critical: 0, important: 1, minor: 2, satisfied: 3 }
      if (statusOrder[a[1].status] !== statusOrder[b[1].status]) {
        return statusOrder[a[1].status] - statusOrder[b[1].status]
      }
      return b[1].diff - a[1].diff
    })

  bcPriority.forEach(([bc, data]) => {
    const relatedCourses = bcToCourses[bc] || []
    const availableCourses = relatedCourses
      .map(id => coursesData.find(c => c.id === id))
      .filter(c => c && !selectedSet.has(c.id))
      .sort((a, b) => {
        // Sort by contribution to this BC
        const contribA = a.bcContribution[bc] || 0
        const contribB = b.bcContribution[bc] || 0
        return contribB - contribA
      })
      .slice(0, 3) // Top 3 courses for this BC

    if (availableCourses.length > 0) {
      recommendations.push({
        bc,
        gap: data.diff,
        status: data.status,
        courses: availableCourses.map(c => ({
          ...c,
          contributionToBC: c.bcContribution[bc]
        })),
        reason: generateReason(bc, data, availableCourses[0])
      })
    }
  })

  return recommendations
}

// Generate human-readable explanation for recommendation
function generateReason(bc, gapData, topCourse) {
  const reasons = {
    critical: `Critical gap: Your target career requires ${gapData.target} points in ${bc}, but you have ${gapData.current}. "${topCourse.name}" provides +${topCourse.bcContribution[bc]} points.`,
    important: `Important improvement: You need ${gapData.diff} more points in ${bc} to reach the target of ${gapData.target}. "${topCourse.name}" contributes +${topCourse.bcContribution[bc]} points.`,
    minor: `Suggested enhancement: Taking "${topCourse.name}" (+${topCourse.bcContribution[bc]} ${bc} points) would help reach the target of ${gapData.target}.`
  }
  return reasons[gapData.status] || reasons.minor
}

// Calculate overall match percentage
export function calculateMatchPercentage(gap) {
  const bcList = Object.values(gap)
  if (bcList.length === 0) return 0

  const totalTarget = bcList.reduce((sum, data) => sum + data.target, 0)
  const totalCurrent = bcList.reduce((sum, data) => sum + Math.min(data.current, data.target), 0)
  
  return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
}

// Generate learning path (ordered recommendations)
export function generateLearningPath(recommendations) {
  const path = []
  const usedCourses = new Set()

  recommendations.forEach(rec => {
    rec.courses.forEach(course => {
      if (!usedCourses.has(course.id)) {
        usedCourses.add(course.id)
        path.push({
          ...course,
          primaryBC: rec.bc,
          gapStatus: rec.status,
          step: path.length + 1
        })
      }
    })
  })

  return path.slice(0, 15) // Limit to 15 steps
}

// Get status summary for display
export function getStatusSummary(gap) {
  const summary = {
    satisfied: 0,
    minor: 0,
    important: 0,
    critical: 0
  }

  Object.values(gap).forEach(data => {
    summary[data.status]++
  })

  return summary
}
