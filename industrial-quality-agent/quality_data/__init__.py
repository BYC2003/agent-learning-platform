# 这个文件把 quality_data 目录声明为 Python 包。
# 外部代码可以从这里导入合成数据生成器。
from .generator import SyntheticQualityGenerator

__all__ = ["SyntheticQualityGenerator"]
