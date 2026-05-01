export function scrollToSection(href: string) {
  const element = document.querySelector(href)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    })
  }
}
