const cap = require('../src/index.js')
var assert = require('assert')
var should = require('should')

const tol = 0.02

const closest = function(arr, val) {
  var arrDelta = arr.map((item) => Math.abs(item - val))
  const x = Math.min.apply(0, arrDelta)
  const i = arrDelta.indexOf(x)
  return arr[i]
}

/**
Get data for closest time given
*/
const dataAt = function(arr, time) {
  const closestTime = closest(arr.map((item) => item.time), time)
  const row = arr.filter((item) => item.time === closestTime)[0]
  // normalize data for easier access
  var objSource = row.data ? row.data : row
  var data = {closestTime: closestTime}
  Object.keys(objSource).map((k) => data[k] = objSource[k])
  return data
}

describe('Inductor', function() {
  describe('transient', function() {
  const testData = require('./rl_transient_01.tsv')

    it('should match voltage response', function() {
      var netlist = [
        'vs va 0 0',
        'r1 va vb 1e3',
        'l1 vb 0 1'
      ]

      var jscap = new cap()

      var cir = jscap.parse(netlist)
      var dt = 0.001e-3
      var iterations = 20e-3/dt
      var t = 0
      for (var i = 0; i <= iterations; i++) {
        jscap.simulate(cir, dt)
        if (t < 10e-3) cir.elements.vs.state.v = 0
        if (t >= 10e-3 && t <= 11e-3) cir.elements.vs.state.v = (5/(11e-3 - 10e-3))*(t - 10e-3)
        if (t > 11e-3) cir.elements.vs.state.v = 5
        t = jscap.results[i].time
      }

      [0.011, 0.0115, 0.012, 0.014].map((t) => {
        (dataAt(testData, t)['v(vb)']).should.be.approximately(dataAt(jscap.results, t)['v(vb)'], tol)
      })
    })
  })
})

describe('Capacitor', function() {
  describe('transient', function() {
  const testData = require('./rc_transient_01.tsv')

    it('should match voltage response', function() {
      var netlist = [
        'vs va 0 0',
        'r1 va vb 1e3',
        'c1 vb 0 1e-6'
      ]

      var jscap = new cap()

      var cir = jscap.parse(netlist)
      var dt = 0.001e-3
      var iterations = 20e-3/dt
      var t = 0
      for (var i = 0; i <= iterations; i++) {
        jscap.simulate(cir, dt)
        if (t < 10e-3) cir.elements.vs.state.v = 0
        if (t >= 10e-3 && t <= 11e-3) cir.elements.vs.state.v = (5/(11e-3 - 10e-3))*(t - 10e-3)
        if (t > 11e-3) cir.elements.vs.state.v = 5
        t = jscap.results[i].time
      }

      [0.011, 0.0115, 0.012, 0.014].map((t) => {
        (dataAt(testData, t)['v(vb)']).should.be.approximately(dataAt(jscap.results, t)['v(vb)'], tol)
      })
    })
  })
})