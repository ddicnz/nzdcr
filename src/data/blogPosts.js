import body10ThingsAuckland from '../content/blog-post-10-things-auckland-body.html?raw'
import bodyBestTimeRentNz from '../content/blog-post-best-time-rent-nz-body.html?raw'
import bodyRoadTripChChQtn from '../content/blog-post-road-trip-christchurch-queenstown-body.html?raw'
import bodyRoadTripAklCape from '../content/blog-post-road-trip-auckland-cape-reinga-body.html?raw'
import bodyRoadTripAklTaupo from '../content/blog-post-road-trip-auckland-taupo-body.html?raw'
import bodyRoadTripWlgChCh from '../content/blog-post-road-trip-wellington-christchurch-body.html?raw'
import { ROAD_HERO_IMG } from './pageHeros'

/**
 * Blog listing metadata. Add a row here for each post, and register its HTML in `BLOG_BODY_BY_SLUG`.
 * @typedef {{
 *   slug: string
 *   title: string
 *   heroHeading: string
 *   excerpt: string
 *   dateLabel: string
 *   dateSort: string
 *   category?: string
 *   coverImage?: string
 *   blogMap?: (
 *     | { variant: 'route', title?: string, segments: Array<{ from: [number, number], to: [number, number] }>, googleDirectionsUrl?: string }
 *     | { variant: 'place', title?: string, center: [number, number], zoom: number, googleMapsUrl?: string }
 *     | { variant: 'branches', title?: string }
 *   )
 * }} BlogPostMeta
 */

/** @type {BlogPostMeta[]} */
const BLOG_POSTS = [
  {
    slug: 'best-time-to-rent-a-car-in-new-zealand',
    title: 'Best Time to Rent a Car in New Zealand: A Complete Guide for Tourists and Locals',
    heroHeading: 'BEST TIME TO RENT A CAR IN NEW ZEALAND',
    excerpt:
      'Season-by-season guide: summer peaks, autumn value, winter ski trips, spring quiet travel — plus when to book and how vehicle choice affects availability.',
    dateLabel: '16 June 2025',
    dateSort: '2025-06-16',
    category: 'Travel tips',
    coverImage: ROAD_HERO_IMG,
  },
  {
    slug: 'road-trip-auckland-to-cape-reinga',
    title: 'Auckland to Cape Reinga: The Ultimate Northland Loop',
    heroHeading: 'AUCKLAND TO CAPE REINGA',
    excerpt:
      'Two scenic corridors — Kauri Coast and Hokianga, or East Coast and Bay of Islands — combining into a memorable northern loop.',
    dateLabel: '24 May 2024',
    dateSort: '2024-05-24',
    category: 'Road trips',
    coverImage: ROAD_HERO_IMG,
    blogMap: {
      variant: 'route',
      title: 'Indicative driving route: Auckland to Cape Reinga / Te Rerenga Wairua',
      segments: [
        { from: [-36.8485, 174.7633], to: [-34.428, 172.6855] },
      ],
      googleDirectionsUrl:
        'https://www.google.com/maps/dir/Auckland,+New+Zealand/Cape+Reinga,+New+Zealand',
    },
  },
  {
    slug: 'road-trip-auckland-to-taupo-central-plateau',
    title: 'Road Trip: Auckland to Taupo and the Central Plateau',
    heroHeading: 'AUCKLAND TO TAUPO & CENTRAL PLATEAU',
    excerpt:
      'SH1 through Waikato towns, Lake Taupo, and onward to Tongariro volcanoes — geothermal stops, skiing, and alpine walks.',
    dateLabel: '30 April 2024',
    dateSort: '2024-04-30',
    category: 'Road trips',
    coverImage: ROAD_HERO_IMG,
    blogMap: {
      variant: 'route',
      title: 'Indicative driving route: Auckland to Taupo (SH1-style corridor)',
      segments: [{ from: [-36.8485, 174.7633], to: [-38.6857, 176.0702] }],
      googleDirectionsUrl:
        'https://www.google.com/maps/dir/Auckland,+New+Zealand/Taupo,+New+Zealand',
    },
  },
  {
    slug: 'road-trip-christchurch-to-queenstown',
    title: 'Road Trip: Christchurch to Queenstown',
    heroHeading: 'CHRISTCHURCH TO QUEENSTOWN',
    excerpt:
      'Canterbury Plains, Mackenzie Basin lakes, Aoraki Mt Cook side trips, Cromwell, and the Kawarau Gorge into Queenstown.',
    dateLabel: '30 April 2024',
    dateSort: '2024-04-30',
    category: 'Road trips',
    coverImage: ROAD_HERO_IMG,
    blogMap: {
      variant: 'route',
      title: 'Indicative driving route: Christchurch to Queenstown',
      segments: [{ from: [-43.5321, 172.6362], to: [-45.0312, 168.6626] }],
      googleDirectionsUrl:
        'https://www.google.com/maps/dir/Christchurch,+New+Zealand/Queenstown,+New+Zealand',
    },
  },
  {
    slug: 'road-trip-wellington-to-christchurch',
    title: 'Road Trip: Wellington to Christchurch',
    heroHeading: 'WELLINGTON TO CHRISTCHURCH',
    excerpt:
      'Cook Strait ferry, Marlborough Sounds, wine country, Kaikōura wildlife, and the coast to Christchurch.',
    dateLabel: '30 April 2024',
    dateSort: '2024-04-30',
    category: 'Road trips',
    coverImage: ROAD_HERO_IMG,
    blogMap: {
      variant: 'route',
      title: 'Road legs via SH1: Wellington–Picton and Picton–Christchurch (Cook Strait ferry not shown)',
      segments: [
        { from: [-41.2866, 174.7756], to: [-41.2906, 174.001] },
        { from: [-41.2906, 174.001], to: [-43.5321, 172.6362] },
      ],
      googleDirectionsUrl:
        'https://www.google.com/maps/dir/Wellington,+New+Zealand/Christchurch,+New+Zealand',
    },
  },
  {
    slug: '10-things-to-do-in-auckland-part-1',
    title: '10 Things to do in Auckland — Part 1',
    heroHeading: '10 THINGS TO DO IN AUCKLAND · PART 1',
    excerpt:
      'Harbour icons, history, sport, shopping, museums, Hauraki Gulf islands, gardens, art, parks, and family attractions — ideas for your Auckland visit.',
    dateLabel: '30 April 2024',
    dateSort: '2024-04-30',
    category: 'City guide',
    coverImage: ROAD_HERO_IMG,
  },
]

const BLOG_BODY_BY_SLUG = {
  'best-time-to-rent-a-car-in-new-zealand': bodyBestTimeRentNz,
  'road-trip-auckland-to-cape-reinga': bodyRoadTripAklCape,
  'road-trip-auckland-to-taupo-central-plateau': bodyRoadTripAklTaupo,
  'road-trip-christchurch-to-queenstown': bodyRoadTripChChQtn,
  'road-trip-wellington-to-christchurch': bodyRoadTripWlgChCh,
  '10-things-to-do-in-auckland-part-1': body10ThingsAuckland,
}

/** Newest first (`dateSort`); same-day posts sort by slug for stable order. */
export function getBlogPostsSorted() {
  return [...BLOG_POSTS].sort((a, b) => {
    if (a.dateSort !== b.dateSort) {
      return a.dateSort < b.dateSort ? 1 : -1
    }
    return a.slug.localeCompare(b.slug)
  })
}

/**
 * @param {string} slug
 * @returns {null | (BlogPostMeta & { bodyHtml: string })}
 */
export function getBlogPost(slug) {
  const meta = BLOG_POSTS.find((p) => p.slug === slug)
  if (!meta) return null
  const bodyHtml = BLOG_BODY_BY_SLUG[slug]
  if (!bodyHtml) return null
  return { ...meta, bodyHtml }
}
