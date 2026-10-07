# 运行合成数据生成器的命令行入口。
# 示例：python generate_data.py --output data/synthetic_demo --batches 120 --seed 42

from __future__ import annotations

import argparse
from pathlib import Path

from quality_data.generator import SyntheticQualityGenerator


def parse_args() -> argparse.Namespace:
    """读取命令行参数。"""
    parser = argparse.ArgumentParser(description="生成工业质量合成演示数据")
    parser.add_argument("--output", type=Path, default=Path("data/synthetic_demo"))
    parser.add_argument("--batches", type=int, default=120)
    parser.add_argument("--seed", type=int, default=42)
    return parser.parse_args()


def main() -> None:
    """生成数据并打印结果。"""
    args = parse_args()
    try:
        generator = SyntheticQualityGenerator(
            output_dir=args.output,
            batch_count=args.batches,
            seed=args.seed,
        )
        manifest = generator.generate()
    except ValueError as exc:
        print(f"参数错误：{exc}")
        raise SystemExit(2) from exc

    print("合成数据生成完成")
    print(f"输出目录：{args.output.resolve()}")
    print(f"批次数：{manifest['batch_count']}")
    print(f"文档数：{manifest['document_count']}")
    print(f"评测问题数：{manifest['question_count']}")


if __name__ == "__main__":
    main()
