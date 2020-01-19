const a = [
  { id: "abc", title: "T1" },
  { id: "abcd", title: "T2" },
  { id: "abcx", title: "T3" }
]

const res = a.filter(item => item.id !== "abcx")
//.indexOf("abcx")
//const res = a.indexOf()
console.log(a)
console.log(res)
