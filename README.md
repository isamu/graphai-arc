

ai2_arc取得
```
git clone https://huggingface.co/datasets/allenai/ai2_arc/
```

ファイルの実体を取得
```
brew install git-lfs
git lfs pull
```

データのデコード
```
pip install pandas pyarrow
```

```
import pandas as pd

parquet_file = 'test-00000-of-00001.parquet'
json_file = 'test-00000-of-00001.json'
df = pd.read_parquet(parquet_file)
df.to_json(json_file, index=False)
```

テスト

```
yarn run test
```

上記で生成したjsonのシンプル版のテストが走る
```
ai2_arc/test.json
```

全てテストするには、以下のファイルに差し換える
```
ai2_arc/test-00000-of-00001.json
```