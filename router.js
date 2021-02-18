var express = require('express')
var router = express.Router()

const pays = require('./pays')

let paysPrecedent

const genChiffreAleatoire = () => {
  return Math.floor(Math.random() * pays.length)
}

const paysAleatoire = () => {
  let chiffreAleatoire = genChiffreAleatoire()
  while (chiffreAleatoire === paysPrecedent) {
    chiffreAleatoire = genChiffreAleatoire()
  }
  return pays[chiffreAleatoire]
}

const quatreDrapeauxAleatoires = () => {
  const quatreDrapeauxAleatoires = []
  while (quatreDrapeauxAleatoires.length < 4) {
    let paysGenere = paysAleatoire()
    if (quatreDrapeauxAleatoires.indexOf(paysGenere) < 0) {
      quatreDrapeauxAleatoires.push(paysGenere)
    }
  }
  return quatreDrapeauxAleatoires
}

router.get('/', (req, res, next) => {
  res.render('home')
})

router.get('/play', (req, res, next) => {
  const quatrePays = quatreDrapeauxAleatoires()
  const drapeauADeviner = quatrePays[Math.floor(Math.random() * 4)].flag
  const quatreNomsDePays = quatrePays.map(pays => pays.nom)
  res.render('index', { drapeauADeviner, quatreNomsDePays })
})

const corriger = (reponseUtilisateur) => {
  const bonneReponse = pays.find(element => element.flag === reponseUtilisateur.drapeau)
  return {
    reponseEstValide: reponseUtilisateur.pays === bonneReponse.nom,
    pays: bonneReponse.nom,
    drapeau: bonneReponse.flag
  }
}

router.post('/correction', (req, res, next) => {
  const reponse = {
    pays: req.body.pays,
    drapeau: req.body.drapeau
  }
  const correction = corriger(reponse)
  res.render('correction', { correction })
})

module.exports = router
