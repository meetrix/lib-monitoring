import Monitor from "../src/lib-call-quality-monitoring"

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("Monitor is instantiable", () => {
    expect(new Monitor({ backendUrl: 'https://meetrix.io'})).toBeInstanceOf(Monitor)
  })
})
