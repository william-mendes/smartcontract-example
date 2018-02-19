contract('Initialization Tests', accounts => {

  describe('Fixtures Tests', () => {

    it("Should not throw exeption while loading fixtures", async() => {
      var fixtures = require('../TestFixtures.json')

      assert(fixtures.ETHER_CAP)
      assert(fixtures.TOKEN_CAP)
      assert(fixtures.TEAM_SUPPLY_PERCENTAGE)
      assert(fixtures.ICO_RATE)
      assert(fixtures.BONUSES)
      assert(fixtures.MIN_TO_INVEST)
      assert(fixtures.TOKEN_NAME)
      assert(fixtures.TOKEN_SYMBOL)
      assert(fixtures.TOKEN_DECIMALS)

      assert(fixtures.TOKEN_CAP>=(fixtures.TOKEN_CAP*fixtures.TEAM_SUPPLY_PERCENTAGE)/100)
    });

  })

})