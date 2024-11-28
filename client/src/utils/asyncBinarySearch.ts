export async function findFirstUnusedIndex(
  isIndexAvailable: (index: number) => Promise<boolean>,
): Promise<number> {
  let low = 0
  let high = 1

  // まずは範囲を動的に見つける
  while (await isIndexAvailable(high)) {
    low = high
    high *= 2 // 倍にすることで範囲を広げる
  }

  // 二分探索で存在しない最初のfileIdを見つける
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (await isIndexAvailable(mid)) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low
}
