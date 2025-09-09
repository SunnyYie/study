const data = [1, 2, 3, 4, 5]

function findNum(): number[]
function findNum(id: number): number
function findNum(nums: number[]): number[]
function findNum(ids?: number[] | number): number[] | number {
  if (typeof ids === 'number') {
    return data.filter(item => item === ids)[0]
  } else if (Array.isArray(ids)) {
    data.push(...ids)
    return data
  } else {
    return data
  }
}
