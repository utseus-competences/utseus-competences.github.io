let tooltipEl = null
let tooltipInitialized = false

function normalizeTarget(target) {
  // Allow passing the event object directly.
  if (target && target.currentTarget) target = target.currentTarget

  // Some browsers can report a text node as the event target.
  if (target && target.nodeType === 3) target = target.parentElement

  return target
}

function createTooltip() {
  // If tooltip element exists and is still in the DOM, reuse it
  if (tooltipEl && document.body.contains(tooltipEl)) {
    tooltipInitialized = true
    return
  }
  
  // Remove old tooltip element if it exists but is detached
  if (tooltipEl && tooltipEl.parentNode) {
    tooltipEl.parentNode.removeChild(tooltipEl)
    tooltipEl = null
  }
  
  // Create new one
  tooltipEl = document.createElement('div')
  tooltipEl.className = 'global-tooltip'
  // Ensure proper display style
  tooltipEl.style.display = 'block'
  // Set initial position to avoid flash
  tooltipEl.style.left = '-9999px'
  tooltipEl.style.top = '-9999px'
  document.body.appendChild(tooltipEl)
  tooltipInitialized = true
}

export function cleanupTooltip() {
  if (tooltipEl && tooltipEl.parentNode) {
    tooltipEl.parentNode.removeChild(tooltipEl)
  }
  tooltipEl = null
  tooltipInitialized = false
}

function updateTooltipPosition(el) {
  el = normalizeTarget(el)
  if (!tooltipEl || !el || !el.getBoundingClientRect) return
  
  // Ensure tooltip is in DOM and visible
  if (!document.body.contains(tooltipEl)) {
    document.body.appendChild(tooltipEl)
  }
  
  const rect = el.getBoundingClientRect()
  
  // Ensure tooltip has dimensions
  let tooltipRect = tooltipEl.getBoundingClientRect()
  if (tooltipRect.width === 0 || tooltipRect.height === 0) {
    // Force minimum dimensions
    tooltipEl.style.minWidth = '180px'
    tooltipEl.style.maxWidth = '320px'
    // Trigger reflow
    const _ = tooltipEl.offsetWidth
    tooltipRect = tooltipEl.getBoundingClientRect()
  }
  
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2
  let top = rect.top - tooltipRect.height - 8
  
  if (left < 8) left = 8
  if (left + tooltipRect.width > window.innerWidth - 8) {
    left = window.innerWidth - tooltipRect.width - 8
  }
  if (top < 8) {
    top = rect.bottom + 8
  }
  
  // Tooltip is `position: fixed` so it must use viewport coordinates.
  tooltipEl.style.left = `${left}px`
  tooltipEl.style.top = `${top}px`
}

export function showTooltip(el, content) {
  el = normalizeTarget(el)
  if (!content || !el || !el.getBoundingClientRect) return
  
  createTooltip()
  
  // Ensure tooltip is ready
  tooltipEl.style.display = 'block'
  tooltipEl.innerHTML = content.replace(/\n/g, '<br>')
  tooltipEl.style.visibility = 'visible'
  tooltipEl.style.opacity = '1'
  
  // Force browser to calculate tooltip dimensions
  // This triggers a reflow so getBoundingClientRect returns correct values
  const _ = tooltipEl.offsetWidth
  
  // Update position
  updateTooltipPosition(el)
  
  // Double-check position after a frame in case dimensions changed
  requestAnimationFrame(() => {
    if (tooltipEl && tooltipEl.style.visibility === 'visible') {
      updateTooltipPosition(el)
    }
  })
}

export function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.style.opacity = '0'
    tooltipEl.style.visibility = 'hidden'
  }
}

export const vTooltip = {
  mounted(el, binding) {
    el._tooltipContent = binding.value
    if (!el._tooltipContent) return
    
    // Remove any existing listeners (in case of element reuse)
    if (el._tooltipShow) {
      el.removeEventListener('mouseenter', el._tooltipShow)
    }
    if (el._tooltipHide) {
      el.removeEventListener('mouseleave', el._tooltipHide)
    }
    
    const show = () => {
      showTooltip(el, el._tooltipContent)
    }
    
    const hide = () => {
      hideTooltip()
    }
    
    el._tooltipShow = show
    el._tooltipHide = hide
    
    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)
  },
  
  updated(el, binding) {
    el._tooltipContent = binding.value
  },
  
  unmounted(el) {
    if (el._tooltipShow) {
      el.removeEventListener('mouseenter', el._tooltipShow)
    }
    if (el._tooltipHide) {
      el.removeEventListener('mouseleave', el._tooltipHide)
    }

    hideTooltip()
  }
}
