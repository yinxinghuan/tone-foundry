import { strict as assert } from 'node:assert'
import { webcrypto } from 'node:crypto'
globalThis.crypto = webcrypto as Crypto
const { BODY_BRIDGES, BODY_PICKUPS } = await import('../src/ToneFoundry/guitar-system/modularBoltOnPlatform')
const { SET_BODY_BRIDGES, SET_BODY_PICKUPS } = await import('../src/ToneFoundry/guitar-system/modularSetNeckPlatform')
const { BUILD_STAGES, applyOffer, createRunSeed, drawOffers } = await import('../src/ToneFoundry/gameplay/buildRun')
type BuildGrade = 'workshop' | 'select' | 'archive'

const grades: Record<BuildGrade, number> = { workshop: 0, select: 0, archive: 0 }
const candidateCounts = new Set<number>()
const runs = 2500

for (let index = 0; index < runs; index += 1) {
  const seed = createRunSeed()
  let config = seed.config
  for (const stage of BUILD_STAGES) {
    const offers = drawOffers(stage, seed.platform, config, seed.id)
    candidateCounts.add(offers.length)
    assert.ok(offers.length >= 2 && offers.length <= 3, `${stage}: ${offers.length}`)
    assert.equal(new Set(offers.map((offer) => offer.id)).size, offers.length)
    for (const offer of offers) grades[offer.grade] += 1
    config = applyOffer(config, stage, offers[index % offers.length])
  }
  if (seed.platform === 'bolt-on') {
    assert.ok(BODY_PICKUPS[config.body as keyof typeof BODY_PICKUPS].includes(config.pickups as never))
    assert.ok(BODY_BRIDGES[config.body as keyof typeof BODY_BRIDGES].includes(config.bridge as never))
  } else {
    assert.ok(SET_BODY_PICKUPS[config.body as keyof typeof SET_BODY_PICKUPS].includes(config.pickups as never))
    assert.ok(SET_BODY_BRIDGES[config.body as keyof typeof SET_BODY_BRIDGES].includes(config.bridge as never))
  }
}

const total = grades.workshop + grades.select + grades.archive
const ratio = (grade: BuildGrade) => grades[grade] / total
assert.ok(ratio('workshop') > .62 && ratio('workshop') < .74)
assert.ok(ratio('select') > .22 && ratio('select') < .33)
assert.ok(ratio('archive') > .035 && ratio('archive') < .07)

console.log(JSON.stringify({ runs, candidateCounts: [...candidateCounts], grades, ratios: {
  workshop: ratio('workshop'), select: ratio('select'), archive: ratio('archive'),
}}, null, 2))
