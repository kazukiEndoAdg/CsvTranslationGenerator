console.log('translation program has started');
const langInfo = {
  "ja": "JA",
  "en": "EN",
  "zh-CHS": "ZH",
  "ko": "KO",
};

const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const yargs = require("yargs");
const axios = require("axios");

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

  /**
   * 翻訳処理
   */
  const translate = async (jaString, targetLanguage) => {
    const config = {
      headers: {
        Authorization: '',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',  
      },
    };
    const params = {
      text: jaString,
      target_lang: langInfo[targetLanguage],
    };

    return new Promise((resolve) => {
      setTimeout(async () => {
        // ここで実際の翻訳結果を取得するか、テキストをコピーします。
        await axios.post('https://api-free.deepl.com/v2/translate', params, config).then((res) => {
          result = res.data.translations[0].text;
          // console.log('translation result', result);
          translatedText = result;
        }).catch((err)=>{
          console.log('error occurred when translating: ', err);
        });

        resolve(translatedText);
      }, 1000); // 1秒待機
    });
  }

  const translateToMultipleLanguages = async (text, targetLanguages) => {
    console.log('text', text);
    const translatedInformation = {};
    translatedInformation['ja'] = text;
  
    for (const language of targetLanguages) {
      const translation = await translate(text, language);
      translatedInformation[language] = translation;
    }
    console.log('translation results' ,translatedInformation);
    return translatedInformation;
  };  

const csvWriter = createCsvWriter({
  path: outputFilePath,
  header: [
    { id: "ja", title: "ja" },
    { id: "en", title: "en" },
    { id: "zh-CHS", title: "zh-CHS" },
    { id: "ko", title: "ko" },
  ],
  append: true, // 追記モードを有効にする
});

// ヘッダーを出力
// csvWriter.writeRecords(Object.keys(langInfo));
// 翻訳&出力処理
fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", async (row) => {
    // ここで翻訳処理を実装するか、テキストをコピーすることができます。
    // 以下はテキストをコピーする例です。
    const translations = [];
    const result = await translateToMultipleLanguages(row['ja'], Object.keys(langInfo).filter((lang) => lang !== 'ja'));
    translations.push(result);
    await csvWriter
    .writeRecords(translations).then(()=>{
      console.log(`Translation results saved to ${outputFilePath}`);
    });
  })
  .on("end", () => {
    // csvWriter
    //   .writeRecords(translations)
    //   .then(() => {
    //     console.log(`Translation results saved to ${outputFilePath}`);
    //   })
    //   .catch((error) => {
    //     console.error("Error writing CSV:", error);
    //   });

    });
