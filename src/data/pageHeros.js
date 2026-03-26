/** Road photo used on inner pages (under orange nav). */
export const ROAD_HERO_IMG = '/pic/new-zealand-road.jpg'

export function roadHero(heading, breadcrumbLast) {
  return {
    heading,
    breadcrumbLast,
    imageSrc: ROAD_HERO_IMG,
  }
}
