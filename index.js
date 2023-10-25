const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const yargs = require("yargs");

// コマンドライン引数の設定
const argv = yargs
  .usage("Usage: $0 -i <inputfile> -o <outputfile>")
  .demandOption(["i", "o"])
  .alias("i", "input")
  .nargs("i", 1)
  .describe("i", "Input CSV file containing Japanese text")
  .alias("o", "output")
  .nargs("o", 1)
  .describe("o", "Output CSV file")
  .help("h")
  .alias("h", "help").argv;

const inputFilePath = argv.input;
const outputFilePath = argv.output;

const csvWriter = createCsvWriter({
  path: outputFilePath,
  header: [
    { id: "JA", title: "ja" },
    { id: "EN", title: "en" },
    { id: "ZHCHS", title: "zh-CHS" },
    { id: "ZHCHT", title: "zh-CHT" },
    { id: "KO", title: "ko" },
  ],
});

const translations = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    // ここで翻訳処理を実装するか、テキストをコピーすることができます。
    // 以下はテキストをコピーする例です。

    translations.push({
      JA: row.text,
      EN: row.text,
      ZHCHS: row.text,
      ZHCHT: row.text,
      KO: row.text,
    });
  })
  .on("end", () => {
    csvWriter
      .writeRecords(translations)
      .then(() => {
        console.log(`Translation results saved to ${outputFilePath}`);
      })
      .catch((error) => {
        console.error("Error writing CSV:", error);
      });
  });
