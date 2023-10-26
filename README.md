# CsvTranslationGenerator

## How to use
前提として、DeepL APIを利用して翻訳を行います。本プログラムを実行する前にDeepL APIのアカウントを取得し、.envファイルにAPIキーを設定してください。

1. input.csvに原文となる日本語を記載します。一度に複数の原文を翻訳したい場合は翻訳したい分だけ複数行記載してください。
2. ルートディレクトリでdocker compose upを実行します。
3. 翻訳がcsv形式で出力されます。
