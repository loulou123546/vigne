export const grappeMetreCarre = (grappes, cepsComptes, distanceInterRang, distanceInterPlante) => {
  const grappeMetreCarre = grappes / cepsComptes / distanceInterRang / distanceInterPlante

  return {
    rendement1: (area) => {
      const rendement = grappeMetreCarre * 135 * 0.001 * area * 10000

      return rendement - rendement * 0.13
    },
    rendement2: (poidsGrappeMoyen, area) => {
      const rendement = grappeMetreCarre * poidsGrappeMoyen * 0.001 * area * 10000

      return rendement - rendement * 0.13
    }
  }
}
