const basePath = process.cwd();
const fs = require("fs");

const needsOfRarity = {
  "SSS": 2,
  "SS": 20,
  "S": 160,
  "A": 268,
}

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);
let uselessEditions = [];

const getIndexOfRarity = (raity, metadataList) => {
  let indexOfRarity = [];

  metadataList.forEach((metadata, index) => {
    if (metadata.attributes[0].value === raity) {
      indexOfRarity.push(index + 1);
    }
  });

  return indexOfRarity;
}

const uselessEditionsOfRarity = (raity, indexes) => {
  if (indexes.length > needsOfRarity[raity]) {
    const numberOfUselessEditions = needsOfRarity[raity] - indexes.length;
    return indexes.slice(numberOfUselessEditions);
  }
  return [];
}


for (const raity in needsOfRarity) {
  uselessEditions = uselessEditions.concat(uselessEditionsOfRarity(raity, getIndexOfRarity(raity, data)));
}

data = data.filter((metadata) => {
  return !uselessEditions.includes(metadata.edition);
});

fs.writeFileSync(
  `${basePath}/build/json/_deleted_metadata.json`,
  JSON.stringify(data, null, 2)
);

for (let i = 0; i < uselessEditions.length; i++) {
  const uselessEdition = uselessEditions[i];
  fs.unlinkSync(`${basePath}/build/images/${uselessEdition}.png`);
  fs.unlinkSync(`${basePath}/build/json/${uselessEdition}.json`);

  console.log(`Deleted ${uselessEdition}.png`);
}

// data.forEach((metadata) => {
//   const image = fs.readFileSync(`${basePath}/build/images/${metadata.edition}.png`);

//   if (metadata.attributes[0].value === "A") {
//     fs.writeFileSync(
//       `${basePath}/build/json/A/${metadata.edition}.json`,
//       JSON.stringify(metadata, null, 2)
//     );
//     fs.writeFileSync(
//       `${basePath}/build/images/A/${metadata.edition}.png`,
//       image
//     );
//   } else if (metadata.attributes[0].value === "S") {
//     fs.writeFileSync(
//       `${basePath}/build/json/S/${metadata.edition}.json`,
//       JSON.stringify(metadata, null, 2)
//     );
//     fs.writeFileSync(
//       `${basePath}/build/images/S/${metadata.edition}.png`,
//       image
//     );
//   } else if (metadata.attributes[0].value === "SS") {
//     fs.writeFileSync(
//       `${basePath}/build/json/SS/${metadata.edition}.json`,
//       JSON.stringify(metadata, null, 2)
//     );
//     fs.writeFileSync(
//       `${basePath}/build/images/SS/${metadata.edition}.png`,
//       image
//     );
//   } else if (metadata.attributes[0].value === "SSS") {
//     fs.writeFileSync(
//       `${basePath}/build/json/SSS/${metadata.edition}.json`,
//       JSON.stringify(metadata, null, 2)
//     );
//     fs.writeFileSync(
//       `${basePath}/build/images/SSS/${metadata.edition}.png`,
//       image
//     );
//   }

// });