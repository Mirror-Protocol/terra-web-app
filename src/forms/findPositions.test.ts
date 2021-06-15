import findPositions from "./findPositions"

test("findPositions", () => {
  expect(ids(findPositions("5000000", cdps))).toEqual(["254"])
  expect(findPositions("5000000", cdps)[0].mintAmount).toEqual("5000000")

  expect(ids(findPositions("9613905", cdps))).toEqual(["254"])

  expect(ids(findPositions("10000000", cdps))).toEqual(["254", "240"])
  expect(findPositions("10000000", cdps)[1].mintAmount).toEqual("386095")

  expect(ids(findPositions("49558377", cdps))).toEqual(sortedAll)
})

const ids = (cdps: CDP[]) => cdps.map(({ id }) => id)

const sortedAll = [
  "254",
  "240",
  "243",
  "245",
  "242",
  "247",
  "255",
  "244",
  "246",
]

const cdps = [
  {
    id: "244",
    address: "terra172lej3qguwp4yta9k87guuje9hwslwnyfv5lsv",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "4250230",
    collateralToken: "terra16vfxm98rxlc8erj4g0sj5932dvylgmdufnugk0",
    collateralAmount: "15948767",
    collateralRatio: "1.757218",
  },
  {
    id: "242",
    address: "terra1j7vk9094ce24wvrczdl4kpalp44gc94fr4kh88",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "4405737",
    collateralToken: "uusd",
    collateralAmount: "2059999000",
    collateralRatio: "1.771643",
  },
  {
    id: "243",
    address: "terra17787c9yw9369xtdeh23rax57ln9e2050mvwd7v",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "5877049",
    collateralToken: "uusd",
    collateralAmount: "2834999000",
    collateralRatio: "1.827769",
  },
  {
    id: "240",
    address: "terra1ah2z8n530v9593zahjhjv2ujmzhtgg7aulwhz9",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "7836069",
    collateralToken: "uusd",
    collateralAmount: "4000000000",
    collateralRatio: "1.934147",
  },
  {
    id: "247",
    address: "terra1pnl2dg5jadrk4w7wp4y94s4kdfeu62dc850muj",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "3996395",
    collateralToken: "uusd",
    collateralAmount: "2040000000",
    collateralRatio: "1.934147",
  },
  {
    id: "254",
    address: "terra1pnl2dg5jadrk4w7wp4y94s4kdfeu62dc850muj",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "9613905",
    collateralToken: "uusd",
    collateralAmount: "5000000000",
    collateralRatio: "1.970597",
  },
  {
    id: "246",
    address: "terra1pnl2dg5jadrk4w7wp4y94s4kdfeu62dc850muj",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "3545866",
    collateralToken: "terra14gq9wj0tt6vu0m4ec2tkkv4ln3qrtl58lgdl2c",
    collateralAmount: "6503415",
    collateralRatio: "2.058619",
  },
  {
    id: "255",
    address: "terra1pnl2dg5jadrk4w7wp4y94s4kdfeu62dc850muj",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "5565192",
    collateralToken: "terra1ys4dwwzaenjg2gy02mslmc96f267xvpsjat7gx",
    collateralAmount: "1644851",
    collateralRatio: "2.176158",
  },
  {
    id: "245",
    address: "terra14m6xnpx5kurv8vnlusz4qjtxwg20mf6prcgzec",
    token: "terra1374w7fkm7tqhd9dt2r5shjk8ly2kum443uennt",
    mintAmount: "4467934",
    collateralToken: "uusd",
    collateralAmount: "2600000000",
    collateralRatio: "2.204927",
  },
]
