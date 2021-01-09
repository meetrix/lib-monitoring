import Monitor from "./lib-call-quality-monitoring"

/**
 * Dummy test
 */
describe("Monitor Test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("Monitor is instantiable", () => {
    expect(new Monitor({ backendUrl: 'https://meetrix.io'})).toBeInstanceOf(Monitor)
  })
})
