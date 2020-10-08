import { truncate } from "./text"

test("text", () => {
  const ADDRESS = "terra1srw9p49fa46fw6asp0ttrr3cj8evmj3098jdej"
  expect(truncate(ADDRESS)).toBe("terra1...98jdej")
  expect(truncate(ADDRESS, [5, 3])).toBe("terra...dej")
})
