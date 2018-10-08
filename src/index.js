var numeric = require('../vendor/numeric-1.2.6.min');
module.exports = function() {
  var results = []
  var time = 0
  this.results = results
  var stateModels = {
    v: function(obj) {
      var self = this
      this.v = parseFloat(obj.line[obj.line.length - 1])
      this.tick = function (el, res, dt) {
      }
    },      
    r: function(obj) {
      var self = this
      this.r = parseFloat(obj.line[obj.line.length - 1])
      this.tick = function (el, res, dt) {
      }
    },
    c: function(obj) {
      var self = this
      this.C = parseFloat(obj.line[3])
      this.v = 0
      this.i = 0
      this.tick = function (el, res, dt) {
        var i = res['i('+el.name+')']
        self.v += (1/self.C) * i * dt
        self.i = i
      }
    },
    l: function(obj) {
      var self = this
      this.L = parseFloat(obj.line[3])
      this.v = 0
      this.i = 0
      this.tick = function (el, res, dt) {
        var i = res['i('+el.name+')']
        var v = res[el.nodes[0]]
        var di = i - self.i
        self.v = v
        self.i -= (1/self.L) * self.v * dt
      }
    }
  }
  this.parse = (netlist) => {
    var cir = {}
    // parse circuit list get useful info object
    cir.parsedElements = netlist
      .map((line) => line.split(' ')
      .filter((l) => l !== ''))
      .map((line) => {
        var type = line[0][0]
        var obj = {
          line: line,
          nodes: [line[1], line[2]],
          name: line[0],
          type: type,
          connections: [],
          state: undefined
        }

        obj.state = !!stateModels[type] ? new stateModels[type](obj) : null
        return obj
      })
    ;
    cir.elements = {}
    cir.parsedElements.map((el) => cir.elements[el.name] = el)

    // figure out how components connected with each other
    cir.parsedElements.map((el) => {
      cir.parsedElements.filter((elTarget) => elTarget.name !== el.name)
      .map((elTarget) => {
        for (var i = 0; i < elTarget.nodes.length; i++) {
          var targetNode = elTarget.nodes[i]
          if (el.nodes.indexOf(targetNode) !== -1) {
            el.connections.push({el: elTarget, on: targetNode})
          }
        }
      })
    })

    cir.allNodes = []
    cir.parsedElements
      .map((el) => el.nodes.map((node) => cir.allNodes.push(node)))
    ;

    cir.voltageSources = cir.parsedElements
      .filter((el) => ['v', 'c'].indexOf(el.type) !== -1)
    ;

    // https://www.swarthmore.edu/NatSci/echeeve1/Ref/mna/MNA2.html
    // add current source to node list, so the matrix will have
    // correct dimensions
    cir.voltageSources.map((el) => {
      cir.allNodes.push('i('+el.name+')')
    })

    // get list of uniq nodes identification
    cir.currNodes = cir.allNodes.filter((v, i, a) => a.indexOf(v) === i && v !== '0')
    return cir
  }
  this.simulate = function(cir, dt) {
    var sim = {}
    var YmxObj = []
    sim.Ymx = []
    sim.Imx = []
    cir.currNodes.map((node, nodeIndex) => {
      var Yobj = {}
      for (var i = 0; i < cir.currNodes.length; i++) {
        Yobj[cir.currNodes[i]] = 0
      }
      var I = 0
      // iterate over all elements connected to current node
      cir.parsedElements
        .filter((el) => el.nodes.indexOf(node) !== -1)
        .map((el) => {

          // current direction is out from node
          if (['i', 'l'].indexOf(el.type) !== -1) {
            I += el.state.i
          }

          if (['v', 'c'].indexOf(el.type) !== -1) {
            // flag voltage source connection
            Yobj['i('+el.name+')'] = (el.nodes[0] === node ? 1 : -1)
          }

          if (['r'].indexOf(el.type) !== -1) {
            Yobj[node] += 1/el.state.r
            // get all the nodes from other side of element
            el.nodes
              .filter((elNode) => elNode !== node & elNode !== '0')
              .map((nodeNeg) => Yobj[nodeNeg] -= 1/el.state.r)
            ;
          }
        })
      ;
      YmxObj.push(Yobj)
      var Y = cir.currNodes.map((node) => Yobj[node])
      sim.Ymx.push(Y)
      sim.Imx.push(I)
    })

    // still dealing with voltage sources.
    // https://www.swarthmore.edu/NatSci/echeeve1/Ref/mna/MNA2.html
    // Get where voutage source cols/rows starts on matrix
    var offset = sim.Imx.length - cir.voltageSources.length

    // get cols
    var voltageSourcesYmxCols = sim.Ymx.map((row) => row.slice(offset))

    // transpose, as the bottom part is the transpose of voltage cols part
    var voltageSourcesYmxColsTransposed = voltageSourcesYmxCols[0]
      .map((col, i) => voltageSourcesYmxCols.map(row => row[i]))
    ;

    // set transposed data on matrix and source values
    cir.voltageSources.map((el, i) => {
      // get value from state if avaliable. If not, its
      // a voltage source and we should get it's value
      sim.Imx[i+offset] = el.state.v
      sim.Ymx[i+offset] = voltageSourcesYmxColsTransposed[i]
    })

    var res = {}
    
    numeric.solve(sim.Ymx, sim.Imx)
      .map((item, i) => res[cir.currNodes[i]] = item)
    ;
    
    results.push({time: time, data: res})
    
    cir.parsedElements.map((el) => {
      if (el.state) {
        el.state.tick(el, res, dt)
      }
    })
    time += dt
    return res
  }
}
