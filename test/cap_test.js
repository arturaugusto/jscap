const cap = require('../src/index.js')
const csvParse = require('csv-parse')
var assert = require('assert')

const closest = function(arr, val) {
  var arrDelta = arr.map((item) => Math.abs(item - val))
  const x = Math.min.apply(0, arrDelta)
  const i = arrDelta.indexOf(x)
  return arr[i]
}

/**
Get data for closest time given
Normalize data for easier access
*/
const dataAt = function(arr, time) {
  const closestTime = closest(arr.map((item) => item.time), time)
  const row = arr.filter((item) => item.time === closestTime)[0]
  return {closestTime: closestTime, data: row.data ? row.data : row}
}

describe('Array', function() {
  describe('#indexOf()', function() {
  const testData = require('./rl_transient_01.tsv')

    it('should return -1 when the value is not present', function() {
      var netlist = [
        'vs va 0 5',
        'r1 va vb 1e3',
        'l1 vb 0 1'
      ]

      var jscap = new cap()

      var cir = jscap.parse(netlist)
      var dt = 0.02e-3
      var iterations = 20e-3/dt
      for (var i = 0; i <= iterations; i++) {
        if (dt*i > 11e-3) cir.elements.vs.state.v = 5
        if (dt*i < 10e-3) cir.elements.vs.state.v = 0
        if (dt*i >= 10e-3 && dt*i <= 11e-3) cir.elements.vs.state.v += 0.10
        jscap.simulate(cir, dt)
      }
      console.log(dataAt(testData, 0.012).data['v(va)'])
      console.log(dataAt(jscap.results, 0.012).data)
      assert.equal([1,2,3].indexOf(4), -1)
    })
  })
})