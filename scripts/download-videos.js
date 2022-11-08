/*
 * Put an array of PLAYBACK_IDS, then run with 
 *
 * node ./scripts/download-videos.js
 *
 * (must be on Node 18+)
 *
 * This will download the highest level mp4 available and a gif for each playback ID
 *
 * Output will go to ./download-videos-script/ which is .gitignore-d
 */

const PLAYBACK_IDS = [
  "1nhfK01NJG8yEUyf02KfgM9iQ4B00HwlRLaGWuY3S5yWfA",
  "b02Zk00GJho01QhpoFnA02rwxkqkjxCkLv1c9WuAPB00L028Q",
  "i4OiNi7TlZ00AKVul1bnqEY7c02oFjoAWgdRKv4Qehliw",
  "jOA00zDWGC5q5ddtDNoi1W24zw3wrFI7Kf8qkfMyBs94",
  "HkAqiwbpzDPsQakFgJ02UPciKZ1t5DFrtc02oQu6gKnTM",
  "mp7oZqscnON6Mu3A9bVySVGgMPb025jZhAhB748194tk",
  "7tLUdXvxzWgWrsK00lQd029u7IVuBYpYR01ojJzBc7D00SY",
  "LSnIP1AcAvc5yXML7i943zCHigQGtuyvPxi00tHA9l3w",
  "irDcFddJtmSsaZwA43SoWReiolxZfv02bSuskohF027ks",
  "idCS4I4CLCl3jBAY6IJsc5QVTR7zWI5L02n600KyAdM028",
  "GYxKQRdWHodiG3K4xQjl6jtQGTqrDW401GjMqW8xRgo4",
  "f9UKRLS8pM8COiDip82Rd7yYo2Yl1bDQCJgb8lScQgE",
  "6arwRQpXeC4h8Ec7rpj5JnsfTv3Q47vO7w2MIBWDrAY",
  "iaDQZqkORvOt700M01nZpElsHAwvX600klGX98tUUWGiqM",
  "reZX00ewEYbmWvjPDDURS5U01F02kMKf00tGZQ8JBQEjdzw",
  "l01ikyaWkJ0002AA01oMRUic3ILTFXWapPd5WInoThu02CV4",
  "s702eQjMjtrfKjogW600TrEX9MoO4tzKGFiXq6cuTp3yg",
  "kOHSa1bixjXeR02i3ZCwCsWMFe02Mkeyj4tPRDV3qtTAE",
  "KpRM4HzSJfV02P7Y5QONOPVOk00el1DiQrsWV02F4TGgLw",
  "G002yzuZZSy00YG6Bt74a2Z2H02Nu6hnZx1My8cls6EJbg",
  "iyB486sOJdPdzUsPh6qDq01GP01pPnhL0011LG5ChvrqpM",
  "jbKuNPLCX02UokEO801fdD44Y31vzCech5zjv7DJLix02s",
  "Ok2AsFYB7fdf002wqs004sFpm1Pvjo57gIfOCJsSHiFGc",
  "F2Sd7I7vkJvlB8R6lrPBJjnUzTgDvMdnuDGLO3CnlNY",
  "cjpbWkVwWJqZs6i00022IWjz8vb3HjuFwa801QQYqVsEIQ",
  "XqXUMl02KwNKGx66o2jnafdC3o2GsgXWT01VSz8NX00ZKY",
  "mQWSRZw016p7JIhN02cjmaKMmDpO8j4VqsSDbSm02cCQeo",
  "BVqM3mTiOPdXgcb8wu7L2BBUhdRUoRxQCvVDQK2uB9E",
  "orATkCzxiEtdLGaSoq8Lb01CLTMet8IG52m5iLnXtm3Q",
  "yZzx4gOeNCZea02nyq5uFBzAh181DXVutCWjzuGmhv700",
  "5FROdupNGaDIf6xBaIJvQToog02CqqyzrvffYC00lph4A",
  "1ew2G8eXM6jsNph00wqVzS6X1leyuWzbHT02NWsZnykn00",
  "Wn6a626Ec6k6D2e01Lz2I02zZHBswN02kqWsLrdcQwgRaI",
  "S02hrL9xNcHzWsGmwsEjsGgE4501qthA5mybSgHu4mDn00",
  "02ed6draqCzfMdwcYd3UEivJJrOfoiT8z3x9aj00015AkY",
  "5iRo00rVFu5NFNyokgnScD7o022bmNt2uNwpUxPUcKFgY",
  "00o3yb00oYSOjTh00601H00No00wmISWUGf1TF1jgbLF9022gU",
  "ojLc585ou01WORENuE6mcOcvT5Sl9C171XaVxcuEaYBI",
  "nz00hZjRUC6snau4OzNgevp00uNeEn01kuRL7dSPKZuyYY",
  "01AOq101HAKxvHqzZrN8tbfq2a4CqYWQu2NcK5Y016DpZc",
  "nCxC00dnXYGc00Yt00af5wSR01J2obsryvfWBeSLv84Fgys",
  "eRV1r5v01j1ibny02roay4B5MiLNbbjDkPAGGmqmnZh00E",
  "RwnSygij6Yp00cro9xLxhMy01jlkl00gruisKcKbZ2e5gc",
  "VpQcmPA1f4rGrA02TPy003Q6q701bkbLTqSvK3ZLfIHQr8",
  "x5qmaDdEPa3NgG2HVyG4APinNJrrW5sfRUk00TkJpqmA",
  "kkcLUHo5ZSf69lE39MibwEswBr7b37wUOATo02L1PR100",
  "ucxX5Q251UIIf3BiCdAW6CD00KYxzcTgFuOrAKQfzWlE",
  "7z8AJPW95cdHkdXQATpwGN9EaIdKFbkirjP9GUsUCq4",
  "Vgjo1blIafkDGY8ajzjahnxFhCrkty71EGxVvdK7xtE",
  "N02HudqLCPtxyMxHUg5uQ01aM4pGnVGSHK4fQ44TnxknE",
  "oivR01EVkPFM7x89ie7oZQVYJdpxP71019iivw01tCiKOk",
  "aRwE5of300H33lvfOXMO00l2kfsqdAu53koAaOt01WK3vU",
  "9x2YYinIuBdkvBWHtOu966x021jE9U5RjBeyFM7TOF2M",
  "j01h8XH5naCcf00gamVTt9RJywfwvzP4uyhIwEAgQXqpU",
  "R02GlewVSsWJ8qsIGW3vN02a8cpf017uR269ETf3qtD01fk",
  "bORL501cgjYR01QWVXdLlg8uYYnjUpl5um53LPwG9xPVY",
  "XVICflPLG3EEC02qpiTsrXb7lcAMWuaKpQAAcsQWUg1o",
  "4Bfawonc8KtYnig5WQ7BLxfw85h6wsjsF02Z6eB4xrV4",
  "GQa4UZQGNZ660201sT2CXhciu000000rpxpGQdF1N00Ml302KQ",
  "ngZQV5Rj02EEFRJdomvjR3vvpL3FDk02bv4yADSWR1oPc",
  "kIWTbSYlCZRZ3kbXu4Vi002fmjxDRt315FzKsA5eDN3E",
  "kyCNtpEEaAVO4fnnEKYkyjIVz6YLPj8dXU02hYI02Cc9Y",
  "007rPHs5krAqgso3ccf9W6E02e2vCe00k01CX1BQAWygr3I",
  "zrr00XV7kGr1CY00QSAAlbKvcPZbUy7yWZWc00gzTGjxOk",
  "lXDqdyvZBT1iskAoNftK01sRsYeMYvIxPnjKqsjgXAis",
  "HOz1VR7Nk4BHHF02Y4G8Yn9vR9cozneexqD1jrkz9Wk00",
  "Xyh1tw2u2b4tQH02gUftUILBt8DOCHV2SJk3L5g00vSl00",
  "e9fsytXcmLKlOChGmNVLCUTIyEIqKm012vFIr8hK4nmI",
  "RpjjCLX1qTwVFs01rxhye4v6UnboFjOMGkVwIKw2gYhs",
  "GKOgZqEMQMyGIsn9o01IfiDN914M5Wid4OI8GUyiTssg",
  "eXesr86y79xoE5LwQdc9Ib01auCwxVb2zjxCFA02hnaYQ",
  "cEMZx5rUbYWyLGE9SlTw015v01E02tZglNtJuy1iHqBi6s",
  "b698jASHie2U19uzhN8B15Ncj9jh7myXFha9m00Or7kU",
  "cCeJHbYyhBAuAe4aBoRcSb0187dhckux6qpqyXK7UZEk",
  "PxL8MJuld2U3V4NPIDEn2MgPQCbLxLDQD1DJO00ocvSU",
  "YKTDdgeZRU1wToUUkR01sJqH01JcKcZSXbZSq6DpCRJu00",
  "cfO006r4Cg00ichTJ3vouhTTmbyZTeijg00xL2sYRaojsA",
  "ktR01k02FGYbK00Mk7qddYR006PVeeeFfOqdYoPOLyZjGNk",
  "m6SfMXzm8NtQP6dPvofW4l7mEDFTLUfWnT3NoB7oisU",
  "HQrK1hMWB6vz4yBly5mRM7BNYUeglHB9AfOtUTU02AYA",
  "y3Zj3DLU1L7BYazCw00HQyUYlXV2ocTQtxOaREPG9Oq8",
  "AaEKkFXoL6mxZCOmVsAikuK1uLnjhu41ofIHPQ0000wPo",
  "l6Aie3fUMAQn7cSqzpnslXibLMNx02QnjzaesV9iyJQs",
  "001GFwbhXej01Q9TJHMH3BHA8012cRepqV2BtLNG5yo3Ec",
  "wpJZqDJiE02Bz1MP6g2b4tcgbtuawJ01RHKD101ju3ind4",
  "dQL00Fgr7S7JlX01VqWt9WgREQ02YufWmG2NTnax4kF01g8",
  "saH6QGPa9CQudCTL9EU5vtppKVWQfC1a97EYWVD0157c",
  "QHIyc6ITI4rtl3EBjAQVMO00otPdtPpIVDNNcEWUx18c",
  "2h9GrVV9GAbMHenQ2pFkh01J4QB6yO7l7o2pAob34V1c",
  "krJxphy0262ttazOcAvNcrsft00FL8xkjR00TwNgv7s2FY",
  "6AvrVHy4DygmkSHd6QgyBtc255NAyiemeiOPTvXqwzc",
  "c9dy41tJoDgVCg00xmMj1QvY3x3t8DDqz4lDvFPBh6is",
  "gOm8BbUTpLW7xXfMsY02yuWxOOn3fwqZpbdMESqCYdyY",
  "hbW5dJw00ZZeF2cY74n9m92DbEwT62zNh00F00WwijYM01U",
  "f502OpGndZNYhW00UV5iCZQ3SCC302bSvEPzdQ00SXe5VZI",
  "xCILZCLHR7tX0200jBTlnbeTU5pZkny3hKNMTkEZrRP01Y",
  "xlxp3CEjjt5KO2dyXwrwNYHsVjQGfiMjLIWI4BHQPCM",
  "t5uAY011sQrREEzIu02KWtmjtFVBj02qsYgk27CuQZ1kSg",
  "qs7L01uHtgh01JKW0157U7WSW02IXnxJ01FumnmYX01fW62dQ",
  "vzh02Ex02xFBZvm01mJlqdl4a7aTtphcTbRVbUVY85IE02Q",
  "EjdK6aUH902txARRC84Ghfp00lVIEwb011yT7JG5z7j4HE",
  "w01vJovJibTsAW8ddFFHuhDxSuro6pmdcV17HppaR7So",
  "23yobF7cyGv007ldeRk17ZmVq00BCEkHbXwXuJV1O6d1w",
  "TxshIr3v2K2ZugGHD7VH95aSyE026mUbwQzp01qZUeFt8",
  "KPuvTiYxA8mEdaDnRJU00PHmTaBT7P02ObeylJ6hLzvjM",
  "YdB0200Y7aOfaIh02qMRfSDqnhoflP0002zyzpmhtvsjs4K8",
  "npZmdX13ejTS02yky8TOBPJ5wGZl5c00YfKrMK1IbPIJg",
  "Oh1F2ZZaHSC4KLlTgRy02Q01jmaRVe8zUwolaWsWhAVdU",
  "isaJzY9tytDU00ha01o00zFJGA6SouANItdsnYXGCVLkgA",
  "7G02Ty00Ml1Sj501t02HYsy01NRSsNYCPBIxUu2xn1KOYfeM",
  "itcQpEiJ1Z0201TTl0088luoLLp2cTzkQKDmljBRi3r9qg",
  "yvevYjKneceaTdmK302y4ihdy7L6iN23H8pMOyPrxPOM",
  "QWgp02sP3Wf3DSoxJ6Oqy012bZSCC8y3kdX027jaXQ4jHE",
  "yC02P00c2Trb8S02qWKGipjbmsCW0100201yEDAbnRy3V02mWQ",
  "tilM3UUZ4ZxZvQWl3dacRjf3Xm01EdqmePzoROQFDT8s",
  "W2nNDasdQpACRc2yaKeE8CqlwswS7XX401fOr4300IP01k",
  "CMcAubBtv9payiVXwq43COot300L3FGPOlJDGDMDrxt00",
  "8dsamD0201jhmhYOdJcAeU00XrFIw5iG6H1myL9BVMBvcU",
]

const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const outputdir = './download-videos-script'

async function downloadGif (playbackId) {
  const res = await fetch(`https://image.mux.com/${playbackId}/animated.gif`);
  if (!res.ok) {
    throw new Error(`Error getting gif for ${playbackId}`);
  }
  const buff = await res.arrayBuffer()
  await writeFile(`${outputdir}/${playbackId}.gif`, Buffer.from(buff));
  console.log(`Wrote gif file for ${playbackId}`);
}

async function downloadVideo (playbackId) {
  let res
  res = await fetch(`https://stream.mux.com/${playbackId}/high.mp4`);
  if (res.ok) {
    console.log(`Downloading high.mp4 for ${playbackId}`);
  } else {
    res = await fetch(`https://stream.mux.com/${playbackId}/medium.mp4`);
  }
  if (res.ok) {
    console.log(`Downloading medium.mp4 for ${playbackId}`);
  } else {
    res = await fetch(`https://stream.mux.com/${playbackId}/low.mp4`);
  }
  if (res.ok) {
    console.log(`Downloading low.mp4 for ${playbackId}`);
  } else {
    throw new Error(`Could not find any static renditions for playback ID ${playbackId}`);
  }
  const buff = await res.arrayBuffer()
  await writeFile(`${outputdir}/${playbackId}.mp4`, Buffer.from(buff));
  console.log(`Wrote mp4 file for ${playbackId}`);
}

async function main () {
  if (!fs.existsSync(outputdir)) {
    await mkdir(outputdir);
  }
  await Promise.all(PLAYBACK_IDS.map(async (playbackId) => {
    await downloadVideo(playbackId);
    await downloadGif(playbackId);
  }));
}

main().then(() => {
  console.log('all done');
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
