import { describe, it, expect } from "vitest"
import { normalizeUrl, isSameUrl } from "./url"

describe("normalizeUrl", () => {
  it("strips https protocol", () => {
    expect(normalizeUrl("https://github.com")).toBe("github.com")
  })

  it("strips http protocol", () => {
    expect(normalizeUrl("http://github.com")).toBe("github.com")
  })

  it("strips www prefix", () => {
    expect(normalizeUrl("https://www.github.com")).toBe("github.com")
  })

  it("strips trailing slash", () => {
    expect(normalizeUrl("https://github.com/")).toBe("github.com")
  })

  it("lowercases the URL", () => {
    expect(normalizeUrl("https://GitHub.COM")).toBe("github.com")
  })

  it("handles URL with path", () => {
    expect(normalizeUrl("https://github.com/explore")).toBe("github.com/explore")
  })

  it("strips trailing slash on path", () => {
    expect(normalizeUrl("https://github.com/explore/")).toBe("github.com/explore")
  })

  it("handles already-normalized URL", () => {
    expect(normalizeUrl("github.com")).toBe("github.com")
  })

  it("strips leading/trailing whitespace", () => {
    expect(normalizeUrl("  https://github.com  ")).toBe("github.com")
  })

  it("strips www without protocol", () => {
    expect(normalizeUrl("www.github.com")).toBe("github.com")
  })
})

describe("isSameUrl", () => {
  it("matches http and https versions", () => {
    expect(isSameUrl("http://github.com", "https://github.com")).toBe(true)
  })

  it("matches www and non-www versions", () => {
    expect(isSameUrl("https://www.github.com", "https://github.com")).toBe(true)
  })

  it("matches with and without trailing slash", () => {
    expect(isSameUrl("https://github.com/", "https://github.com")).toBe(true)
  })

  it("matches case-insensitive", () => {
    expect(isSameUrl("https://GitHub.COM", "https://github.com")).toBe(true)
  })

  it("returns false for different domains", () => {
    expect(isSameUrl("https://github.com", "https://gitlab.com")).toBe(false)
  })

  it("returns false for different paths", () => {
    expect(isSameUrl("https://github.com/explore", "https://github.com/pricing")).toBe(false)
  })

  it("matches all variations combined", () => {
    expect(isSameUrl("HTTP://WWW.GITHUB.COM/", "github.com")).toBe(true)
  })
})
